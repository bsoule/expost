import addBlankLines from "./addBlankLines.js";
import trimContent from "./trimContent.js";
import linkFootnotes from "./linkFootnotes.js";
import expandRefs from "./expandRefs.js";
import { marked } from "marked";
import { markedSmartypants } from "marked-smartypants";
import applyIdsToElements from "./applyIdsToElements.js";
import sanitizeHtml from "sanitize-html";
import { SANITIZE_HTML_OPTIONS } from "./parseMarkdown.options.js";

marked.use(
  markedSmartypants({
    config: "1",
  })
);

marked.use({
  hooks: {
    postprocess: applyIdsToElements,
    // WORKAROUND: @types/marked incorrectly requires `preprocess` to be defined.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

export async function parseMarkdown(
  markdown: string,
  { strict = true }: { strict?: boolean } = {}
): Promise<string> {
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
  const html = await marked.parse(c4);

  return sanitizeHtml(html, SANITIZE_HTML_OPTIONS);
}
