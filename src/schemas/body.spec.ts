import { describe, it, expect } from "vitest";
import { body } from "./body.js";
import ether from "../lib/test/ether.js";

describe("body", () => {
  it("supports em dashes", () => {
    const r = body.parse(
      ether({
        content: "foo -- bar",
      })
    );

    // https://www.codetable.net/name/em-dash
    expect(r).toContain("&#8212;");
  });

  it("throws if no BEGIN_MAGIC", () => {
    expect(() => body.parse("hello world\nEND_MAGIC")).toThrow();
  });

  it("throws if no END_MAGIC", () => {
    expect(() => body.parse("BEGIN_MAGIC\nhello world")).toThrow();
  });

  it("disallows inline script tags", () => {
    expect(
      body.safeParse(
        ether({
          content: "<script></script>",
        })
      )
    ).toEqual(expect.objectContaining({ success: false }));
  });

  it("disallows inline script tags with content", () => {
    expect(
      body.safeParse(
        ether({
          content: "<script>console.log('hello')</script>",
        })
      )
    ).toEqual(expect.objectContaining({ success: false }));
  });

  it("disallows inline style tags with content", () => {
    expect(
      body.safeParse(
        ether({
          content: "<style>body {font-size: 2em;}</style>",
        })
      )
    ).toEqual(
      expect.objectContaining({
        data: expect.stringContaining(
          "&lt;style&gt;body {font-size: 2em;}&lt;/style&gt;"
        ),
      })
    );
  });

  it("parse error includes sanitizeHTML error message", () => {
    const r = body.safeParse(
      ether({
        content: `<iframe src="https://www.example.com"></iframe>`,
      })
    );
    if (r.success) {
      throw new Error("Expected failure");
    }
    expect(r.error.toString()).toContain("Iframe src not allowed");
  });

  it("does not strip title attribute", () => {
    const r = body.parse(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" title="the_title" />`,
      })
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" title="the_title" />`
    );
  });

  it("does not strip alt attribute", () => {
    const r = body.parse(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`,
      })
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" />`
    );
  });

  it("does not strip alt or title attribute", () => {
    const r = body.parse(
      ether({
        content: `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`,
      })
    );

    expect(r).toContain(
      `<img src="https://blog.beeminder.com/image.png" alt="the_alt" title="the_title" />`
    );
  });

  it("does not deform footnote links with numbers", () => {
    const r = body.parse(
      ether({
        content: `<a class="footnote" id="DC21" href="#DC2">[2]</a>`,
      })
    );

    expect(r).toContain('<a class="footnote" id="DC21" href="#DC2">[2]</a>');
  });
});
