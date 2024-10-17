import { describe, it, expect } from "vitest";
import { marked } from "marked";
import ids from "./ids.js";

marked.use(ids);

describe("marked ids extension", () => {
  it("works", () => {
    const r = marked.parse("<p>{#foo}bar</p>");
    expect(r).toBe('<p id="foo">bar</p>');
  });

  it.only("works in combination with italics", () => {
    const r = marked.parse("(words *foo*) {#bar}");
    expect(r).toBe('<p id="bar">(words <em>foo</em>)</p>');
  });

  it("preserves HTML entities", () => {
    const r = marked.parse(
      '<code>{#example} &lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;</code>'
    );

    expect(r).toContain('&lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;');
  });

  it("leaves comments intact", () => {
    const r = marked.parse("<!-- {#foo} -->\n<p>bar</p>");

    expect(r).toContain("<!-- {#foo} -->");
  });

  it("leaves multiline comments intact", () => {
    const r = marked.parse("<!-- {#foo}\nbar -->\n<p>baz</p>");

    expect(r).toContain("<!-- {#foo}\nbar -->");
  });

  it("does not aggressively apply ids to parents", () => {
    const r = marked.parse("> {#foo}bar");

    expect(r).toBe('<blockquote>\n<p id="foo">bar</p>\n</blockquote>\n');
  });

  it("does not decode entities", () => {
    const r = marked.parse(
      "<p>Anyway, in terms of signals that we&#8217;re alive, we have</p>"
    );

    expect(r).toBe(
      "<p>Anyway, in terms of signals that we&#8217;re alive, we have</p>"
    );
  });
});
