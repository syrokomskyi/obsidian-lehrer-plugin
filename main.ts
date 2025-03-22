import { fingerprint } from "@webgogol/core-share";
import { $session } from "lib/store/state";
import { Plugin } from "obsidian";
import { process } from "./lib/process";

export default class ObsidianPlugin extends Plugin {
  async onload() {
    const session = await fingerprint();
    console.log("onload()", { session });
    $session.set(session);

    this.registerMarkdownCodeBlockProcessor("lang", process);
  }
}
