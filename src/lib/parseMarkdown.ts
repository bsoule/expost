import addBlankLines from "./addBlankLines.js";
import trimContent from "./trimContent.js";
import linkFootnotes from "./linkFootnotes.js";
import expandRefs from "./expandRefs.js";
import spaceEMDashes from "./spaceEMDashes.js";
import flattenParagraphs from "./flattenParagraphs.js";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { SANITIZE_HTML_OPTIONS } from "./parseMarkdown.options.js";
import smartypants from "./markedExtentions/smartypants.js";
import urls from "./markedExtentions/urls.js";
import ids from "./markedExtentions/ids.js";

marked.use(urls, smartypants, ids);

export function parseMarkdown(
  markdown: string,
  { strict = true }: { strict?: boolean } = {}
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
        "Failed due to comment syntax error in post. Please make sure all HTML comments are preceeded by a new line."
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
