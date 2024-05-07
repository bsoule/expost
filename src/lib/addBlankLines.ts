// TODO: https://github.com/beeminder/blog/issues/354
const blockElements =
  "address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h\\d|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video";
const regex = new RegExp(`(</?(${blockElements})[^>]*>) *\n+`, "g");

export default function addBlankLines(markdown: string): string {
  return markdown.replace(regex, "$1\n\n");
}
