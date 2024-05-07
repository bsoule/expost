export default function ether({
  before = "",
  content = "",
  after = "",
  title,
}: {
  frontmatter?: Record<string, unknown>;
  before?: string;
  content?: string;
  after?: string;
  title?: string;
  redirects?: string[];
} = {}): string {
  return `${before}
BEGIN_MAGIC${title ? `[${title}]` : ""}
${content}
END_MAGIC
${after}`;
}
