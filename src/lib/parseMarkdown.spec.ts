import { describe, it, expect } from "vitest";
import { parseMarkdown } from "./parseMarkdown.js";
import ether from "./test/ether.js";

describe("body", () => {
  it("supports em dashes", async () => {
    const r = await parseMarkdown(
      ether({
        content: "foo -- bar",
      }),
    );

    // https://www.codetable.net/name/em-dash
    expect(r).toContain("&#8212;");
  });

  it("throws if no BEGIN_MAGIC", async () => {
    await expect(parseMarkdown("hello world\nEND_MAGIC")).rejects.toThrow();
  });

  it("throws if no END_MAGIC", async () => {
    await expect(parseMarkdown("BEGIN_MAGIC\nhello world")).rejects.toThrow();
  });

  it("disallows inline script tags", async () => {
    await expect(
      parseMarkdown(
        ether({
          content: "<script></script>",
        }),
      ),
    ).rejects.toThrow();
  });

  it("disallows inline script tags with content", async () => {
    await expect(
      parseMarkdown(
        ether({
          content: "<script>console.log('hello')</script>",
        }),
      ),
    ).rejects.toThrow();
  });

  it("disallows inline style tags with content", async () => {
    await expect(
      parseMarkdown(
        ether({
          content: "<style>body {font-size: 2em;}</style>",
        }),
      ),
    ).resolves.toEqual(
      expect.stringContaining(
        "&lt;style&gt;body {font-size: 2em;}&lt;/style&gt;",
      ),
    );
  });

  it("parse error includes sanitizeHTML error message", async () => {
    await expect(
      parseMarkdown(
        ether({
          content: `<iframe src="https://www.example.com"></iframe>`,
        }),
      ),
    ).rejects.toThrow("Iframe src not allowed");
  });

  it("does not strip title attribute", async () => {
    const r = await parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" title="the_title" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" title="the_title" />`,
    );
  });

  it("does not strip alt attribute", async () => {
    const r = await parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`,
    );
  });

  it("does not strip alt or title attribute", async () => {
    const r = await parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`,
    );
  });

  it("does not deform footnote links with numbers", async () => {
    const r = await parseMarkdown(
      ether({
        content: `<a class="footnote" id="DC21" href="#DC2">[2]</a>`,
      }),
    );

    expect(r).toContain('<a class="footnote" id="DC21" href="#DC2">[2]</a>');
  });

  it("does not autolink emails", async () => {
    const r = await parseMarkdown(
      ether({
        content: "foo@example.com",
      }),
    );
    expect(r).toContain("<p>foo@example.com</p>");
  });

  it("permits closing brackets after urls", async () => {
    const r = await parseMarkdown(
      ether({
        content: "[moved to http://example.com/foo]",
      }),
    );

    expect(r).toContain(
      '[moved to <a href="http://example.com/foo">http://example.com/foo</a>]',
    );
  });

  it("doesn't try to nest paragraphs", async () => {
    const r = await parseMarkdown(
      ether({
        content: "<p>\n\nfoo</p>",
      }),
    );

    expect(r).toEqual("<p>foo</p>\n");
  });
});
