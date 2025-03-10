import type { MarkdownPostProcessorContext } from "obsidian";
import { Translate } from "translate";
import type { DataBlock, DataRow, Options } from "./types";

function detectDataBlock(source: string): DataBlock {
  // remove any leading/trailing whitespace and split by two or more newlines
  const blocks = source
    .trim()
    .split(/\n\s*\n+\s*\n/)
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

// Match sequences of non-punctuation followed by punctuation and
// optional trailing whitespace or end-of-string.
// Example: "This is one sentence. And here is another!"
// matches "This is one sentence." and "And here is another!"
function splitIntoSentences(text: string): string[] {
  const ellipsis = "…";

  const dotted = text
    // replace some punctuation
    .replace(ellipsis, "...")
    .replace("!..", "!")
    .replace("?..", "?")
    // replace dots between digits with spaces (e.g., 10.000 -> 10 000)
    .replace(/(\d)\.(\d)/g, "$1 $2")
    // replace commas between digits with spaces (e.g., 10,000 -> 10 000)
    .replace(/(\d)\,(\d)/g, "$1 $2")
    // split by new lines
    .split("\n")
    // an each new line should be ended with `.!?`
    .map((s) => {
      const p = s.trim();
      const isSentence = p.endsWith(".") || p.endsWith("!") || p.endsWith("?");
      return isSentence ? p : `${p}.`;
    })
    .join("\n");
  const sentences = dotted.match(/[^.!?]+[.!?]+(\s|$)/g) || [];

  return sentences.map((s) =>
    s
      .trim()
      // clear the punctuation after split by sentences
      .replace("....", "...")
      .replace("...", ellipsis)
      .replace(":.", ":")
      .replace(";.", ";")
      .replace(",.", ","),
  );
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
  tr.createEl("th", { text: dataBlock.options.source ?? "" });
  tr.createEl("th", { text: dataBlock.options.target ?? "" });

  // use the transformed data to create table rows
  for (const row of tableData) {
    const tr = body.createEl("tr");
    tr.createEl("td", { text: `${row.number}`, cls: "number" });
    tr.createEl("td", { text: row.original, cls: "original-text" });
    tr.createEl("td", { text: row.translation, cls: "input-text" });
  }
}
