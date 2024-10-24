export default function trimComments(markdown: string): string {
  // Remove comments embedded within lines of text
  markdown = markdown.replace(/ ?<!--[\s\S]*?-->/g, "");

  return markdown;
}
