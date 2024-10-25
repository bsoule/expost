import { describe, it, expect } from "vitest";
import { marked } from "marked";
import smartypants from "./smartypants.js";

marked.use(smartypants);

describe("marked ids extension", () => {
  it("handles arrows", () => {
    const r = marked.parse("-> `a`");

    expect(r).toContain("<p>-&gt; <code>a</code></p>");
  });

  it("does not encode comment with enpty lines", () => {
    const r = marked.parse(`before
  <!--
foo

bar
-->`);
    expect(r).toContain("<!--");
    expect(r).toContain("-->");
  });
});
