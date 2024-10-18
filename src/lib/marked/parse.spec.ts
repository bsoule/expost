import { describe, it, expect } from "vitest";
import parse from "./parse.js";

describe("marked ids extension", () => {
  it("preserves HTML entities", () => {
    const r = parse(
      '```\n{#example} &lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;\n```'
    );

    expect(r).toContain('&lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;');
  });

  it("does not encode html comments", () => {
    const r = parse(`a\n <!--\nb\n\nc\n-->`);

    console.log(r);

    expect(r).not.toContain("&lt;!&#8212;");
  });
});
