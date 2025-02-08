import { Plugin } from "obsidian";
import { process } from "./lib/process";

export default class CsvCodeBlockPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("lang", process);
  }
}
