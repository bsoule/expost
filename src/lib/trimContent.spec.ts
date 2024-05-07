import { describe, expect, it } from "vitest";
import trimContent from "./trimContent.js";

describe("trimContent", () => {
  it("handles start tag at start of markdown", () => {
    const result = trimContent("BEGIN_MAGIC[title]\nhello world\nEND_MAGIC");

    expect(result).not.toContain("BEGIN_MAGIC");
  });

  it("handles end tag at end of markdown", () => {
    const result = trimContent("BEGIN_MAGIC\nhello world\nEND_MAGIC");

    expect(result).not.toContain("END_MAGIC");
  });

  it("handles start tag without title", () => {
    const result = trimContent("BEGIN_MAGIC\nhello world\nEND_MAGIC");

    expect(result).not.toContain("BEGIN_MAGIC");
  });
});
