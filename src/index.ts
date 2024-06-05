export { parseMarkdown } from "./lib/parseMarkdown.js";

export function parseTitle(content: string): string | undefined {
  return content.match(/BEGIN_MAGIC\[(.*?)\]/)?.[1];
}
