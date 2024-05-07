import { body } from "./schemas/body.js";

export function parseMarkdown(markdown: string): string {
  return body.parse(markdown);
}
