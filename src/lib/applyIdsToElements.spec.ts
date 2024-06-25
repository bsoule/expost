import applyIdsToElements from "./applyIdsToElements.js";
import { describe, it, expect } from "vitest";

describe("applyIdsToElements", () => {
  it("works", () => {
    const r = applyIdsToElements("<p>{#foo}bar</p>");
    expect(r).toBe('<p id="foo">bar</p>');
  });

  it("preserves HTML entities", () => {
    const r = applyIdsToElements(
      '<code>{#example} &lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;</code>',
    );

    expect(r).toContain('&lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;');
  });
});
