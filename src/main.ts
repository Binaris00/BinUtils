import { Editor, MarkdownView, moment, Notice, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, IBinSettings as BinUtilsSettings, BinUtilsSettingTab } from './settings';
import { convertToCallouts, processTime } from './general_utils';

export default class BinUtils extends Plugin {
	settings: BinUtilsSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'convert-raw-file-to-journal',
			name: 'Convert raw file to journal',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const noteFile = this.app.metadataCache.getFirstLinkpathDest(this.settings.rawFile, "/");
				if(noteFile === null) {
					new Notice(`Failed to find raw file by path: "${this.settings.rawFile}"`);
					return;
				}

				let text = await this.app.vault.cachedRead(noteFile);
				const sections = text.split("\n***\n");

				if (sections.length < 2) {
				  new Notice("No separator '***' found");
				  return;
				}


				const processedParagraphs = processTime(sections[1]);
				let callouts = convertToCallouts(processedParagraphs);

				editor.replaceSelection(callouts);
				new Notice("Journal content generated!");
				new Notice(`Content: ${processedParagraphs.length}`)
			}
		});

		this.addCommand({
			id: 'convert-raw-paragraph-to-entry',
			name: 'Convert raw paragraph to entry',
			callback: async () => {
				const noteFile = this.app.metadataCache.getFirstLinkpathDest(this.settings.rawFile, "/");
				if(noteFile === null) {
					new Notice("Failed to find note file by path " + this.settings.rawFile);
					return;
				}
				const links = this.app.metadataCache.getFileCache(noteFile)?.links;
				let text = await this.app.vault.cachedRead(noteFile);
				const processedParagraphs = processTime(text);

				if(links === undefined){
					new Notice("The raw note don't have any links")
					return;
				}

				const now = moment();

				for(const linked of links){
					const linkNote = this.app.metadataCache.getFirstLinkpathDest(linked.link, "");
					if(linkNote === null){ 
						new Notice("Link Path for file is null: " + linked.link)
						continue;
					}
					for(const paragraph of processedParagraphs){
						if(paragraph.paragraph.includes(`[[${linkNote.basename}]]`)){
							this.app.vault.append(linkNote, `
> ${paragraph.paragraph}
`)
							new Notice(`${linked.link} with new entry: ${paragraph.paragraph}`)
						}
					}
				}

				new Notice("Finished progress to set all entries")
				new Notice(`All entries added: ${links.length}`)
			}
		});

		this.addSettingTab(new BinUtilsSettingTab(this.app, this));
	}
	  
	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}