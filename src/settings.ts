import { PluginSettingTab, App, Setting } from "obsidian";
import BinUtils from "./main";
import { FileSuggest } from "./components/suggest";

export interface IBinSettings {
	rawFile: string;
	journal_callout: string;
	journal_callout_alt: string;

}

export const DEFAULT_SETTINGS: IBinSettings = {
	rawFile: 'default_file',
	journal_callout: 'journal_1',
	journal_callout_alt: 'journal_2'
};


export class BinUtilsSettingTab extends PluginSettingTab {
	plugin: BinUtils;

	constructor(app: App, plugin: BinUtils) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		let rawFileSetting = new Setting(containerEl).setName('Raw file').setDesc('used to convert the content in a multi-column callout of 3');
		rawFileSetting.addText((text) => {
			text.setValue(this.plugin.settings.rawFile)
			text.onChange(async (value) => {
				this.plugin.settings.rawFile = value;
				await this.plugin.saveSettings();
			})
		
			new FileSuggest(this.app, text.inputEl);
		})

		let journalCallout1 = new Setting(containerEl).setName('Journal Callout Main').setDesc('Main main main');
		journalCallout1.addText((text) => {
			text.setValue(this.plugin.settings.journal_callout)
			text.onChange(async (value) => {
				this.plugin.settings.journal_callout = value;
				await this.plugin.saveSettings();
			})
		})

		let journalCallout2 = new Setting(containerEl).setName('Journal Callout Alt').setDesc('No main no main no main');
		journalCallout2.addText((text) => {
			text.setValue(this.plugin.settings.journal_callout_alt)
			text.onChange(async (value) => {
				this.plugin.settings.journal_callout_alt = value;
				await this.plugin.saveSettings();
			})
		})
	}
}

