import * as cheerio from "cheerio";

export default function flattenParagraphs(html: string): string {
  // We parse with Cheerio so the parser can unwrap the invalid <p>
  // tags, then we clean them up with a regex.
  const pRegex = /<p>\s*<\/p>/g;
  const $ = cheerio.load(
    html,
    {
      xml: {
        decodeEntities: false,
        xmlMode: false,
      },
    },
    false,
  );

  return $.html().replaceAll(pRegex, "");
}
