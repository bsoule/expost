import { describe, it, expect } from "vitest";
import expandRefs from "./expandRefs.js";

describe("expandRefs", () => {
  it("expands refs", () => {
    const result = expandRefs("$REF[foo]");

    expect(result).toContain("1");
  });

  it("does not link refs", () => {
    const result = expandRefs("$REF[foo]");

    expect(result).not.toContain("href");
  });

  it("retains ref index", () => {
    const result = expandRefs("$REF[foo] $REF[foo]");

    expect(result).not.toContain("2");
  });

  it("increments index over multiple refs", () => {
    const result = expandRefs("$REF[foo] $REF[bar]");

    expect(result).toContain("2");
  });

  it("handls short syntax", () => {
    const result = expandRefs("$REF[foo] $REF[bar]");

    expect(result).toContain("2");
  });

  it("handles multiple refs", () => {
    const result = expandRefs("$REF[foo] $REF[bar] $foo");

    expect(result).toEqual("1 2 1");
  });

  it("retains integer after multiple refs", () => {
    const markdown = `
$REF[fd]
$REF[pr]
$REF[fr]
$REF[en] #$fr
        `;

    const result = expandRefs(markdown);

    expect(result).toContain("#3");
  });
});
