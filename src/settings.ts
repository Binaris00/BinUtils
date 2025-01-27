import { PluginSettingTab, App, Setting } from "obsidian";
import BinUtils from "./main";
import { FileSuggest } from "./components/suggest";

export interface IBinSettings {
	rawFile: string;

}

export const DEFAULT_SETTINGS: IBinSettings = {
	rawFile: 'default_file'
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

		let settingAdd = new Setting(containerEl).setName('Raw file').setDesc('used to convert the content in a multi-column callout of 3');
		settingAdd.addText((text) => {
			text.setPlaceholder('Insert the file path here')
			text.onChange(async (value) => {
				this.plugin.settings.rawFile = value;
				await this.plugin.saveSettings();
			})
		
			new FileSuggest(this.app, text.inputEl);
		})
	}
}

