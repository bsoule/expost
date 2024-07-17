import { describe, it, expect } from "vitest";
import { parseMarkdown } from "./parseMarkdown.js";
import ether from "./test/ether.js";

describe("body", () => {
  it("supports em dashes", () => {
    const r = parseMarkdown(
      ether({
        content: "foo -- bar",
      }),
    );

    // https://www.codetable.net/name/em-dash
    expect(r).toContain("&#8212;");
  });

  it("throws if no BEGIN_MAGIC", () => {
    expect(parseMarkdown.bind(null, "hello world\nEND_MAGIC")).toThrow();
  });

  it("throws if no END_MAGIC", () => {
    expect(parseMarkdown.bind(null, "BEGIN_MAGIC\nhello world")).toThrow();
  });

  it("disallows inline script tags", () => {
    expect(
      parseMarkdown.bind(
        null,
        ether({
          content: "<script></script>",
        }),
      ),
    ).toThrow();
  });

  it("disallows inline script tags with content", () => {
    expect(
      parseMarkdown.bind(
        null,
        ether({
          content: "<script>console.log('hello')</script>",
        }),
      ),
    ).toThrow();
  });

  it("disallows inline style tags with content", () => {
    expect(
      parseMarkdown(
        ether({
          content: "<style>body {font-size: 2em;}</style>",
        }),
      ),
    ).toEqual(
      expect.stringContaining(
        "&lt;style&gt;body {font-size: 2em;}&lt;/style&gt;",
      ),
    );
  });

  it("parse error includes sanitizeHTML error message", () => {
    expect(
      parseMarkdown.bind(
        null,
        ether({
          content: `<iframe src="https://www.example.com"></iframe>`,
        }),
      ),
    ).toThrow("Iframe src not allowed");
  });

  it("does not strip title attribute", () => {
    const r = parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" title="the_title" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" title="the_title" />`,
    );
  });

  it("does not strip alt attribute", () => {
    const r = parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`,
    );
  });

  it("does not strip alt or title attribute", () => {
    const r = parseMarkdown(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`,
      }),
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`,
    );
  });

  it("does not deform footnote links with numbers", () => {
    const r = parseMarkdown(
      ether({
        content: `<a class="footnote" id="DC21" href="#DC2">[2]</a>`,
      }),
    );

    expect(r).toContain('<a class="footnote" id="DC21" href="#DC2">[2]</a>');
  });

  it("does not autolink emails", () => {
    const r = parseMarkdown(
      ether({
        content: "foo@example.com",
      }),
    );
    expect(r).toContain("<p>foo@example.com</p>");
  });

  it("permits closing brackets after urls", () => {
    const r = parseMarkdown(
      ether({
        content: "[moved to http://example.com/foo]",
      }),
    );

    expect(r).toContain(
      '[moved to <a href="http://example.com/foo">http://example.com/foo</a>]',
    );
  });

  it("doesn't try to nest paragraphs", () => {
    const r = parseMarkdown(
      ether({
        content: "<p>\n\nfoo</p>",
      }),
    );

    expect(r).toEqual("<p>foo</p>\n");
  });

  it('allows inputs to have the "checked" attribute', () => {
    const r = parseMarkdown(
      ether({
        content: '<input type="checkbox" checked />',
      }),
    );

    expect(r).toContain('<input type="checkbox" checked />');
  });

  it("escapes special characters in tables", () => {
    expect(
      parseMarkdown(["| foo |", "| --- |", "| <PPR |"].join("\n"), {
        strict: false,
      }),
    ).toBe(
      [
        "<table>",
        "<thead>",
        "<tr>",
        "<th>foo</th>",
        "</tr>",
        "</thead>",
        "<tbody><tr>",
        "<td>&lt;PPR</td>",
        "</tr>",
        "</tbody></table>\n",
      ].join("\n"),
    );
  });
});
