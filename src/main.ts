import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, IBinSettings as BinUtilsSettings, BinUtilsSettingTab } from './settings';

export default class BinUtils extends Plugin {
	settings: BinUtilsSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'convert-raw-file-to-callouts',
			name: 'Convert raw file to callouts',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const noteFile = this.app.metadataCache.getFirstLinkpathDest(this.settings.rawFile, "/");
				if(noteFile === null) {
					new Notice("Failed to find note file by path " + this.settings.rawFile);
					return;
				}

				let text = await this.app.vault.cachedRead(noteFile);
				const processedParagraphs = this.processTime(text);

				let callouts = this.convertToCallouts(processedParagraphs);

				editor.replaceSelection(callouts);
				new Notice("Callouts generated");
			}
		});

		this.addSettingTab(new BinUtilsSettingTab(this.app, this));
	}

	convertToCallouts(paragraphsWithTime: { paragraph: string; time: string }[]): string {
		let result = "";
		let currentGroup: string[] = [];
		const groupSize = 3;
	  
		paragraphsWithTime.forEach(({ paragraph, time }, index) => {
		  currentGroup.push(`>> [!journal_daily_2] ${time}\n>> ${paragraph}`);
		  if (currentGroup.length === groupSize || index === paragraphsWithTime.length - 1) {
			result += `> [!multi-column]\n${currentGroup.join("\n>\n")}\n\n`;
			currentGroup = [];
		  }
		});
	  
		return result.trim();
	}

	processTime(content: string): { paragraph: string; time: string }[] {
		const paragraphs = content.split(/\n\s*\n/);
		const timeRegex = /-?\s*(\d{1,2}:\d{2}\s*(AM|PM))$/i;
		
		return paragraphs.map((paragraph) => {
		  const trimmedParagraph = paragraph.trim();
		  const match = trimmedParagraph.match(timeRegex);
		  const time = match ? match[1] : "0:00 AM-PM";
		  const cleanParagraph = match ? trimmedParagraph.replace(timeRegex, "").trim() : trimmedParagraph;
		  return { paragraph: cleanParagraph, time }; 
		});
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