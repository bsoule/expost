import flattenParagraphs from "./flattenParagraphs.js";
import { describe, it, expect } from "vitest";

describe("flattenParagraphs", () => {
  it("flattens paragraphs", () => {
    const html = "<p><p>foo</p></p>";
    const result = flattenParagraphs(html);

    expect(result).toEqual("<p>foo</p>");
  });
});
