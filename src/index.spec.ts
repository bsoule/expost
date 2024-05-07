import { describe, it, expect } from "vitest";
import { parseMarkdown } from "./index.js";
import ether from "./lib/test/ether.js";

describe("index", () => {
  it("should work", () => {
    expect(parseMarkdown(ether({ content: "# foo" }))).toContain("<h1>");
  });
});
