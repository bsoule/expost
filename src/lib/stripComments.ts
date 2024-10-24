export default function trimComments(markdown: string): string {
  // Remove comments that are the only thing on a line, including the newline character
  markdown = markdown.replace(/^\s*<!--[\s\S]*?-->\s*[\r\n]/gm, "");

  // Remove comments embedded within lines of text
  markdown = markdown.replace(/ ?<!--[\s\S]*?-->/g, "");

  return markdown;
}
