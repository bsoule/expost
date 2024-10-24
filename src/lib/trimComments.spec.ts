import { describe, it, expect } from "vitest";
import trimComments from "./trimComments.js";

describe("trimComments", () => {
  it("removes comments on their own line in cluding newline", () => {
    const r = trimComments(`<!-- hello -->
hello
<!-- world -->
world`);

    expect(r).toEqual("hello\nworld");
  });

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

  it("removes multi-line comments with newlines", () => {
    const r = trimComments(`<!-- hello
world
-->
foo`);

    expect(r).toEqual("foo");
  });
});
