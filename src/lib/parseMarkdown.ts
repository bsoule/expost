import addBlankLines from "./addBlankLines.js";
import trimContent from "./trimContent.js";
import linkFootnotes from "./linkFootnotes.js";
import expandRefs from "./expandRefs.js";
import spaceEMDashes from "./spaceEMDashes.js";
import flattenParagraphs from "./flattenParagraphs.js";
import sanitizeHtml from "sanitize-html";
import { SANITIZE_HTML_OPTIONS } from "./parseMarkdown.options.js";
import parse from "./marked/parse.js";

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
  const c5 = parse(c4);
  const c6 = spaceEMDashes(c5);
  const c7 = flattenParagraphs(c6);

  return sanitizeHtml(c7, SANITIZE_HTML_OPTIONS);
}
