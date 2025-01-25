import { AbstractInputSuggest, TAbstractFile, TFile } from "obsidian";

export class FileSuggest extends AbstractInputSuggest<TFile> {
	textInputEl: HTMLInputElement;
	
	getSuggestions(inputStr: string): TFile[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const files: TFile[] = [];
		const inputLower = inputStr.toLowerCase();

		abstractFiles.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile && ["md", "canvas"].contains(file.extension) &&
				file.path.toLowerCase().contains(inputLower)
			) {
				files.push(file);
			}
		});

		return files;
	}

	renderSuggestion(file: TFile, el: HTMLElement) {
		if (file.extension == "md") {
			el.setText(trimFile(file));
		}
		else {
			//we don't use trimFile here as the extension isn't displayed here
			el.setText(file.path.slice(0, -7))
			el.insertAdjacentHTML(
				"beforeend", 
				`<div class="nav-file-tag" style="display:inline-block;vertical-align:middle">canvas</div>`
			);
		}
	}

	selectSuggestion(file: TFile) {
		this.textInputEl.value = trimFile(file);
		this.textInputEl.trigger("input");
		this.close();
	}
}

export function trimFile(file: TFile): string {
	if (!file) return "";
	return file.extension == "md" ? file.path.slice(0, -3): file.path;
}