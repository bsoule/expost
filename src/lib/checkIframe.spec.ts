import { describe, it, expect } from "vitest";
import checkIframe from "./checkIframe.js";

describe("checkIframe", () => {
  it("throws on unknown iframe src", () => {
    expect(() =>
      checkIframe("iframe", { src: "https://example.com" })
    ).toThrow();
  });

  it("allows known iframe source", () => {
    expect(() =>
      checkIframe("iframe", { src: "https://www.youtube.com/embed/123" })
    ).not.toThrow();
  });
});
