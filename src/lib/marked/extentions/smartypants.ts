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
      const preprocessedHtml = html
        .replace(/<!--|&lt;!--/g, "__OPEN_COMMENT__")
        .replace(/-->|--&gt;/g, "__CLOSE_COMMENT__");

      const smartHtml = smartypants(preprocessedHtml, "1");

      const postprocessedHtml = smartHtml
        .replace(/__OPEN_COMMENT__/g, "<!--")
        .replace(/__CLOSE_COMMENT__/g, "-->");

      return postprocessedHtml;
    },
  },
};

export default extension;
