import spaceEMDashes from "./spaceEMDashes.js";
import { describe, it, expect } from "vitest";

describe("spaceEMDashes", () => {
  it("replaces full spaces around em-dashes", () => {
    const html = "Hello &#8212; world!";
    const result = spaceEMDashes(html);

    expect(result).toBe("Hello&#8201;&#8212;&#8201;world!");
  });

  it("leaves em-dashes without spaces alone", () => {
    const html = "Hello&#8212;world!";
    const result = spaceEMDashes(html);

    expect(result).toBe(html);
  });
});
