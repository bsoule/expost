import addBlankLines from "./addBlankLines.js";
import trimContent from "./trimContent.js";
import linkFootnotes from "./linkFootnotes.js";
import expandRefs from "./expandRefs.js";
import spaceEMDashes from "./spaceEMDashes.js";
import flattenParagraphs from "./flattenParagraphs.js";
import { marked, type Tokens } from "marked";
import { smartypants } from "smartypants";
import applyIdsToElements from "./applyIdsToElements.js";
import sanitizeHtml from "sanitize-html";
import { SANITIZE_HTML_OPTIONS } from "./parseMarkdown.options.js";

const tokenizer = {
  url(src: string): Tokens.Link | false {
    const urlRegex = /^https?:\/\/[^\s\]]+/;
    const match = src.match(urlRegex);

    if (match) {
      return {
        type: "link",
        raw: match[0],
        href: match[0],
        text: match[0],
        tokens: [
          {
            type: "text",
            raw: match[0],
            text: match[0],
          },
        ],
      };
    }

    return false;
  },
};

marked.use({ tokenizer });

marked.use({
  tokenizer: {
    inlineText(src) {
      // don't escape inlineText, unless it's < and >
      const cap = this.rules.inline.text.exec(src);
      const text = cap[0].replace("<", "&lt;").replace(">", "&gt;");

      return {
        type: "text",
        raw: text,
        text: text,
      };
    },
  },
  hooks: {
    postprocess(html) {
      return smartypants(html, "1");
    },
  },
});

marked.use({
  hooks: {
    postprocess: applyIdsToElements,
    // WORKAROUND: @types/marked incorrectly requires `preprocess` to be defined.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

export function parseMarkdown(
  markdown: string,
  { strict = true }: { strict?: boolean } = {},
): string {
  if (strict) {
    if (!markdown.includes("BEGIN_MAGIC")) {
      throw new Error("No BEGIN_MAGIC found");
    }

    if (!markdown.includes("END_MAGIC")) {
      throw new Error("No END_MAGIC found");
    }

    if (/(?<!\n)\n<!--/gm.test(markdown)) {
      throw new Error(
        "Failed due to comment syntax error in post. Please make sure all HTML comments are preceeded by a new line.",
      );
    }
  }

  const c1 = trimContent(markdown);
  const c2 = addBlankLines(c1);
  const c3 = linkFootnotes(c2);
  const c4 = expandRefs(c3);

  const renderer = new marked.Renderer();
  const oldLinkRender = renderer.link;

  renderer.link = function (href, title, text) {
    const emailRegex = /^mailto:\S+@\S+\.\S+$/;
    if (emailRegex.test(href)) {
      return text;
    }

    return oldLinkRender(href, title, text);
  };

  // WORKAROUND: `marked.parse` shouldn't return a promise if
  // the `async` option has not been set to `true`
  // https://marked.js.org/using_pro#async
  const html = marked.parse(c4, { renderer }) as string;

  const htmlSpaced = spaceEMDashes(html);
  const htmlFlattened = flattenParagraphs(htmlSpaced);

  return sanitizeHtml(htmlFlattened, SANITIZE_HTML_OPTIONS);
}
