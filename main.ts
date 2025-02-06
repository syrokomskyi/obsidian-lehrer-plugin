import { Plugin} from 'obsidian';

export default class CsvCodeBlockPlugin extends Plugin {
	
	async onload() {
		this.registerMarkdownCodeBlockProcessor("lang-split-by-sentences", processSplitBySentences);
	}
}

function processSplitBySentences(source: string, el: HTMLElement, ctx: any): void {
	const wrapper = el.createEl("div", {
		cls: "lehrer"
	});
	const table = wrapper.createEl("table");
	const body = table.createEl("tbody");
	const rows = source.split(/((?<=[.!?])\s)|\s+(?=[.!?])/).filter((row) => row.trim().length > 0);
	for (let i = 0; i < rows.length; ++i) {
		const row = body.createEl("tr");
		row.createEl("td", { text: `${i + 1}`, cls: "number" });
		row.createEl("td", { 
			text: rows[i].trim(),
			cls: "original-text"
		});
		row.createEl("td", { 
			text: '',
			cls: "input-text"
		});
	}
}
