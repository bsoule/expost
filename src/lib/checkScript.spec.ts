import { describe, it, expect } from "vitest";
import checkScript from "./checkScript.js";

describe("checkScript", () => {
  it("throws on unknown iframe src", () => {
    expect(() =>
      checkScript("script", { src: "https://example.com" })
    ).toThrow();
  });

  it("allows known script source", () => {
    expect(() =>
      checkScript("script", { src: "https://platform.twitter.com/script.js" })
    ).not.toThrow();
  });
});
