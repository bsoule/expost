import { z } from "zod";
import addBlankLines from "../lib/addBlankLines.js";
import trimContent from "../lib/trimContent.js";
import linkFootnotes from "../lib/linkFootnotes.js";
import expandRefs from "../lib/expandRefs.js";
import { marked } from "marked";
import { markedSmartypants } from "marked-smartypants";
import applyIdsToElements from "../lib/applyIdsToElements.js";
import sanitizeHtml from "sanitize-html";
import { SANITIZE_HTML_OPTIONS } from "./body.options.js";

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

export const body = z
  .string()
  .refine((content) => content.includes("BEGIN_MAGIC"), {
    message: "No BEGIN_MAGIC found",
  })
  .refine((content) => content.includes("END_MAGIC"), {
    message: "No END_MAGIC found",
  })
  .refine((content) => !/(?<!\n)\n<!--/gm.test(content), {
    message:
      "Failed due to comment syntax error in post. Please make sure all HTML comments are preceeded by a new line.",
  })
  .transform(trimContent)
  .transform(addBlankLines)
  .transform(linkFootnotes)
  .transform(expandRefs)
  .transform((md) => marked.parse(md))
  .transform((html, ctx) => {
    try {
      return sanitizeHtml(html, SANITIZE_HTML_OPTIONS);
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      ctx.addIssue({
        message: "failed to parse body",
        code: z.ZodIssueCode.custom,
        params: { error: message },
      });
      return z.NEVER;
    }
  });

export type Body = z.infer<typeof body>;
