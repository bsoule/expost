import { describe, it, expect } from "vitest";
import { marked } from "marked";
import smartypants from "./smartypants.js";

marked.use(smartypants);

describe("marked ids extension", () => {
  it("handles arrows", () => {
    const r = marked.parse("-> `a`");

    expect(r).toContain("<p>-> <code>a</code></p>");
  });

  it("does not encode html comments", () => {
    const r = marked.parse(`a\n <!--\nb\n\nc\n-->`);

    expect(r).not.toContain("&lt;!&#8212;");
  });
});
