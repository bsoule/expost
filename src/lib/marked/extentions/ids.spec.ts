import { describe, it, expect } from "vitest";
import { marked } from "marked";
import ids from "./ids.js";

marked.use(ids);

describe("marked ids extension", () => {
  it("works", () => {
    const r = marked.parse("{#foo}bar");
    expect(r).toContain('<p id="foo">bar</p>');
  });

  it("works in combination with italics", () => {
    const r = marked.parse("(words *foo*) {#bar}");
    expect(r).toContain('<p id="bar">(words <em>foo</em>)</p>');
  });

  it("leaves comments intact", () => {
    const r = marked.parse("<!-- {#foo} -->\nbar");

    expect(r).toContain("<!-- {#foo} -->");
  });

  it("leaves multiline comments intact", () => {
    const r = marked.parse("<!-- {#foo}\nbar -->\nbaz");

    expect(r).toContain("<!-- {#foo}\nbar -->");
  });

  it("does not aggressively apply ids to parents", () => {
    const r = marked.parse("> {#foo}bar");

    expect(r).toBe('<blockquote>\n<p id="foo">bar</p>\n</blockquote>\n');
  });

  it("does not decode entities", () => {
    const r = marked.parse(
      "Anyway, in terms of signals that we&#8217;re alive, we have"
    );

    expect(r).toContain(
      "<p>Anyway, in terms of signals that we&#8217;re alive, we have</p>"
    );
  });

  it("does not concat words surrounding the id", () => {
    const r = marked.parse("foo {#bar} baz");

    expect(r).toContain('<p id="bar">foo baz</p>');
  });

  it("handles code blocks", () => {
    const r = marked.parse("```\n{#foo}\nbar\n```");

    expect(r).toContain('<pre id="foo">');
  });

  it("handles headings", () => {
    const r = marked.parse("# heading {#foo}");

    expect(r).toContain('<h1 id="foo">heading</h1>');
  });
});
