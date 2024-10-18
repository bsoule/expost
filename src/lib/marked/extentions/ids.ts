import { type Tokens, type MarkedExtension, Renderer } from "marked";

function parseContent(token: Tokens.Generic, ctx: Renderer): string {
  const c = token.tokens ? ctx.parser.parseInline(token.tokens) : token.text;
  const r = new RegExp(`\\s?\\{#${token.id}\\}`, "g");
  return c.replace(r, "");
}

const ids: MarkedExtension = {
  walkTokens(token: Tokens.Generic): void {
    if (token.type === "text") return;

    const match = token.tokens?.find(
      (t) => t.type === "text" && /\{#(.*?)\}/.test(t.raw)
    );

    if (!match && token.tokens?.length) return;

    const idMatch = token.raw.match(/\{#(.*?)\}/);

    if (!idMatch) return;

    token.id = idMatch[1];
  },
  renderer: {
    paragraph(t: Tokens.Generic) {
      if (!t.id) return false;
      return `<p id="${t.id}">${parseContent(t, this)}</p>\n`;
    },
    code(t: Tokens.Generic) {
      if (!t.id) return false;
      return `<pre id="${t.id}"><code>${parseContent(t, this)}</code></pre>`;
    },
    heading(t: Tokens.Generic) {
      if (!t.id) return false;
      return `<h${t.depth} id="${t.id}">${parseContent(t, this)}</h${
        t.depth
      }>\n`;
    },
  },
};

export default ids;
