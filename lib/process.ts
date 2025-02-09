import type { MarkdownPostProcessorContext } from "obsidian";
import { Translate } from "translate";
import type { DataBlock, DataRow, Options } from "./types";

function detectDataBlock(source: string): DataBlock {
  // remove any leading/trailing whitespace and split by double newlines
  const blocks = source
    .trim()
    .split(/\n\s*\n/)
    .filter((block) => block.trim().length > 0);

  const options = detectOptions(blocks[0] ?? "");
  const hasOptions = Object.keys(options).length > 0;
  const originalTextIndex = hasOptions ? 1 : 0;

  return {
    options: options,
    original: blocks[originalTextIndex]?.trim() ?? "",
    translation: blocks[originalTextIndex + 1]?.trim() ?? "",
  };
}

// Examples:
//
// 1/ Source and target languages.
// ```text
// de
// uk
// ```
//
// 2/ Target language.
// ```text
// uk
// ```
//
// 3/ Just an original text.
// ```text
// Hello, world!
// ```
function detectOptions(block: string): Options {
  const lines = block
    .trim()
    .split(/\n/)
    .map((line) => line.trim());
  // only languages as ISO 639-1 can be specified
  const linesWithLangauges = lines.filter((line) => line.length === 2);

  const isOptions = lines.length === linesWithLangauges.length;
  const oneLanguageOnly = isOptions && linesWithLangauges.length === 1;

  return isOptions
    ? {
        source: oneLanguageOnly ? undefined : linesWithLangauges[0]?.trim(),
        target: linesWithLangauges[oneLanguageOnly ? 0 : 1]?.trim() ?? "uk",
      }
    : {};
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/((?<=[.!?])\s)|\s+(?=[.!?])/)
    .filter((sentence) => sentence.trim().length > 0)
    .map((sentence) => sentence.trim());
}

async function transformToDataFrame(block: DataBlock): Promise<DataRow[]> {
  const originalSentences = splitIntoSentences(block.original);
  const translationSentences =
    block.translation.length === 0
      ? await translateSentences(block.options, originalSentences)
      : splitIntoSentences(block.translation);

  const originalLength = originalSentences.length;
  const translationLength = translationSentences.length;
  const maxLength = Math.max(originalLength, translationLength);
  originalSentences.length = maxLength;
  translationSentences.length = maxLength;
  originalSentences.fill("", originalLength, maxLength);
  translationSentences.fill("", translationLength, maxLength);

  return originalSentences.map((sentence, index) => ({
    number: index + 1,
    original: sentence,
    translation: translationSentences[index],
  }));
}

// There is a global translation. Reason: we need a cache.
// see https://npmjs.com/package/translate
const translate = Translate({
  engine: "google",
  cache: undefined,
});

async function translateSentences(
  options: Options,
  sentences: string[],
): Promise<string[]> {
  const r: string[] = [];
  for (const sentence of sentences) {
    const translation = await translate(sentence, {
      from: options.source,
      to: options.target,
    });
    r.push(translation);
  }

  return r;
}

export async function process(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
): Promise<void> {
  // detect how many text blocks we have
  const dataBlock = detectDataBlock(source);

  // transform the data blocks to table structure
  const tableData = await transformToDataFrame(dataBlock);

  const wrapper = el.createEl("div", { cls: "lehrer" });
  const table = wrapper.createEl("table");
  const body = table.createEl("tbody");

  const thead = table.createEl("thead");
  const tr = thead.createEl("tr");
  tr.createEl("th", { text: "" });
  tr.createEl("th", { text: dataBlock.options.source ?? "auto" });
  tr.createEl("th", { text: dataBlock.options.target ?? "auto" });

  // use the transformed data to create table rows
  for (const row of tableData) {
    const tr = body.createEl("tr");
    tr.createEl("td", { text: `${row.number}`, cls: "number" });
    tr.createEl("td", { text: row.original, cls: "original-text" });
    tr.createEl("td", { text: row.translation, cls: "input-text" });
  }
}
