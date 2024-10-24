import type { MarkedExtension, Tokens } from "marked";
import { smartypants } from "smartypants";

const extension: MarkedExtension = {
  tokenizer: {
    inlineText(src: string): false | Tokens.Text | undefined {
      // don't escape inlineText
      const cap = this.rules.inline.text.exec(src);
      const raw = cap?.[0] ?? "";
      const text = raw.replace("<", "&lt;").replace(">", "&gt;");

      return {
        type: "text",
        raw,
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
