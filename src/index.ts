import { body } from "./schemas/body.js";

export function parseMarkdown(markdown: string): string {
    return body.parse(markdown);
}

export function parseTitle(content: string): string | undefined {
    return content.match(/BEGIN_MAGIC\[(.*?)\]/)?.[1];
}
