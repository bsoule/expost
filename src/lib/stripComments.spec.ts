import { describe, it, expect } from "vitest";
import trimComments from "./stripComments.js";

describe("trimComments", () => {
  it("removes comments embedded within lines of text", () => {
    const r = trimComments(`hello <!-- world -->`);

    expect(r).toEqual("hello");
  });

  it("removes multi-line comments", () => {
    const r = trimComments(`hello <!--
world
-->
world`);

    expect(r).toEqual("hello\nworld");
  });
});
