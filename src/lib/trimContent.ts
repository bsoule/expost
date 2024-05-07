export default function trimContent(content: string): string {
  return content
    .replace(/.*BEGIN_MAGIC(?:\[(.*?)\])?/s, "")
    .replace(/END_MAGIC.*/s, "");
}
