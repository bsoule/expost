import type { MarkedExtension, Tokens } from "marked";
import { smartypants } from "smartypants";

const extension: MarkedExtension = {
  tokenizer: {
    inlineText(src: string): false | Tokens.Text | undefined {
      // don't escape inlineText
      const cap = this.rules.inline.text.exec(src);
      const raw = cap?.[0] ?? "";

      return {
        type: "text",
        raw,
        text: raw,
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
