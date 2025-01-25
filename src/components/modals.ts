import { Modal, App, Setting } from "obsidian";
import { FileSuggest } from "./suggest";
import BinJournaling from "src/main";


export class BaseModal extends Modal {
    private plugin: BinJournaling;
    private simpleFile: string;
    private complexFile: string;

	constructor(app: App, plugin: BinJournaling) {
		super(app);
        this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
        this.render();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
        this.plugin.logic(this.simpleFile);
	}

    private render(){
		const {contentEl} = this;

        contentEl.empty();

        contentEl.createEl("h2", { text: "Select both files that are going to be used" });
        const simpleFile = new Setting(contentEl).setName("Simple File");
        simpleFile.addText((text) => {
            new FileSuggest(this.app, text.inputEl);
            text.setValue("Insert simple file here");
            text.onChange(async (value) => {
                this.simpleFile = value;
            })
        });

        const complexFile = new Setting(contentEl).setName("Complex File");
        complexFile.addText((text) => {
            new FileSuggest(this.app, text.inputEl);
            text.setValue("Insert complex file here");
            text.onChange(async (value) => {
                this.complexFile = value;
            })
        });
    }
}
