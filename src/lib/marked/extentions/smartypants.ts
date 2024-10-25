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
      // Preprocess to escape sequences you don't want to be transformed
      const preprocessedHtml = html
        .replace(/<!--|&lt;!--/g, "__OPEN_COMMENT__")
        .replace(/-->|--&gt;/g, "__CLOSE_COMMENT__");

      console.log("proprocessed", preprocessedHtml);

      // Apply smartypants
      const smartHtml = smartypants(preprocessedHtml, "1");

      console.log("smart", smartHtml);

      // Postprocess to unescape the sequences back to their original form
      const postprocessedHtml = smartHtml
        .replace(/__OPEN_COMMENT__/g, "<!--")
        .replace(/__CLOSE_COMMENT__/g, "-->");

      console.log("postprocessed", postprocessedHtml);

      return postprocessedHtml;
    },
  },
};

export default extension;
