import { DataBlock, DataRow } from './types';

function detectTextBlocks(source: string): DataBlock {
    // remove any leading/trailing whitespace and split by double newlines
    const blocks = source.trim().split(/\n\s*\n/).filter(block => block.trim().length > 0);
    
    return {
        original: blocks[0]?.trim() || '',
        translation: blocks[1]?.trim() || ''
    };
}

function splitIntoSentences(text: string): string[] {
    return text
        .split(/((?<=[.!?])\s)|\s+(?=[.!?])/)
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim());
}

function transformToDataFrame(blocks: DataBlock): DataRow[] {
    const originalSentences = splitIntoSentences(blocks.original);
    const translationSentences = splitIntoSentences(blocks.translation);
    
    return originalSentences.map((sentence, index) => ({
        number: index + 1,
        original: sentence,
        translation: translationSentences[index] || ''
    }));
}

export function process(source: string, el: HTMLElement, ctx: any): void {
    // detect how many text blocks we have
    const { original, translation } = detectTextBlocks(source);

    // transform 2 text blocks to table structure
    const tableData = transformToDataFrame({ original, translation });

    const wrapper = el.createEl("div", {
        cls: "lehrer"
    });
    const table = wrapper.createEl("table");
    const body = table.createEl("tbody");
    
    // use the transformed data to create table rows
    for (const row of tableData) {
        const tr = body.createEl("tr");
        tr.createEl("td", { text: `${row.number}`, cls: "number" });
        tr.createEl("td", { text: row.original, cls: "original-text" });
        tr.createEl("td", { text: row.translation, cls: "input-text" });
    }
}
