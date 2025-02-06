import { Plugin} from 'obsidian';

export default class CsvCodeBlockPlugin extends Plugin {
	
	async onload() {
		this.registerMarkdownCodeBlockProcessor("lang-split-by-sentences", (source, el, ctx) => {
			const table = el.createEl("table");
			const body = table.createEl("tbody");
			const rows = source.split(/((?<=[.!?])\s)|\s+(?=[.!?])/).filter((row) => row.trim().length > 0);
			for (let i = 0; i < rows.length; ++i) {
				const row = body.createEl("tr");
				row.createEl("td", { text: `${i + 1}` });
				row.createEl("td", { text: rows[i].trim() });
				row.createEl("td", { text: '' });
			}
		});
	}	
}
