import { Token, MarkedOptions } from "marked";
import applyIdsToElements from "../applyIdsToElements.js";
import getDom from "../getDom.js";

export default {
  walkTokens(token: Token): Token | undefined | false {
    console.log("token", token);

    if (token.type === "text") return;
    if (!("tokens" in token)) return;
    if (token.tokens?.length === 0) return;

    const match = token.tokens?.find(
      (t) => t.type === "text" && /\{#(.*?)\}/.test(t.raw)
    );

    if (!match) return;

    const idMatch = token.raw.match(/\{#(.*?)\}/);
    if (!idMatch) return false;

    token.text = token.text.replace(idMatch[0], "");

    const $ = getDom(token.text);

    $(":root").attr("id", idMatch[1]);

    token.text = $.html();
  },
  hooks: {
    // postprocess: applyIdsToElements,
    // WORKAROUND: @types/marked incorrectly requires `preprocess` to be defined.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};
