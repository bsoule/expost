import type { MarkedExtension, Tokens } from "marked";
import { smartypants } from "smartypants";

const extension: MarkedExtension = {
  tokenizer: {
    inlineText(src: string): false | Tokens.Text | undefined {
      // don't escape inlineText, unless it's < and >
      const cap = this.rules.inline.text.exec(src);
      const text = cap?.[0]?.replace("<", "&lt;")?.replace(">", "&gt;") ?? "";

      return {
        type: "text",
        raw: text,
        text: text,
      };
    },
  },
  hooks: {
    postprocess(html: string) {
      return smartypants(html, "1");
    },
  },
};

export default extension;