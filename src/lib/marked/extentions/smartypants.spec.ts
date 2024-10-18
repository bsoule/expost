import { describe, it, expect } from "vitest";
import { marked } from "marked";
import smartypants from "./smartypants.js";

marked.use(smartypants);

describe("marked ids extension", () => {
  it("handles encoding arrows", () => {
    const r = marked.parse("-> `a`");

    expect(r).toContain("<p>-&gt; <code>a</code></p>");
  });
});
