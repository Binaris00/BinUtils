import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings } from './noused';
import { BaseModal } from './components/modals';

export default class BinJournaling extends Plugin {
	settings: MyPluginSettings;
	callouts: string;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new BaseModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection(this.callouts);
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}


	 async logic(path: string){
		const noteFile = this.app.metadataCache.getFirstLinkpathDest(path, "/");
		if(noteFile === null) {
			new Notice("Failed to find note file by path " + path);
			return;
		} 

		let text = await this.app.vault.read(noteFile);
  		const processedParagraphs = this.processMarkdown(text);

		this.callouts = this.convertToCallouts(processedParagraphs);
		new Notice("Termino el proceso")
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
	processMarkdown(content: string): { paragraph: string; time: string }[] {
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

class SampleSettingTab extends PluginSettingTab {
	plugin: BinJournaling;

	constructor(app: App, plugin: BinJournaling) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
