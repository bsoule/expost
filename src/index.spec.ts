import { describe, it, expect } from "vitest";
import { parseTitle, parseMarkdown } from "./index.js";
import ether from "./lib/test/ether.js";

describe("index", () => {
  describe("parseMarkdown", () => {
    it("should work", async () => {
      const result = await parseMarkdown(ether({ content: "# foo" }));

      expect(result).toContain("<h1>");
    });

    it("should honor strict option false", async () => {
      await expect(
        parseMarkdown("# foo", { strict: false })
      ).resolves.toContain("<h1>");
    });
  });

  describe("parseTitle", () => {
    it("parses title", () => {
      const content = "BEGIN_MAGIC[title]";
      expect(parseTitle(content)).toBe("title");
    });

    it("returns undefined if no title", () => {
      const content = `BEGIN_MAGIC
helle world`;
      expect(parseTitle(content)).toBeUndefined();
    });

    it("returns blogmorphosis title", () => {
      const content = `BEGIN_MAGIC[Ditching WordPress and a Shiny Blog Redesign]`;
      expect(parseTitle(content)).toBe(
        "Ditching WordPress and a Shiny Blog Redesign"
      );
    });
  });
});
