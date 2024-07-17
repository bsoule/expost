import { describe, it, expect } from "vitest";
import linkFootnotes from "./linkFootnotes.js";

describe("linkFootnotes", () => {
  it("links footnotes", () => {
    const result = linkFootnotes("$FN[foo] $FN[foo]");

    expect(result).toContain(
      '<a class="footnote" id="foo1" href="#foo">[1]</a>',
    );
  });

  it("links last to first", () => {
    const result = linkFootnotes("$FN[foo] $FN[foo]");

    expect(result).toContain(
      '<a class="footnote" id="foo" href="#foo1">[1]</a>',
    );
  });

  it("handles shortened syntax", () => {
    const result = linkFootnotes("$foo $FN[foo]");

    expect(result).toContain(
      '<a class="footnote" id="foo1" href="#foo">[1]</a>',
    );
  });

  it("handles shortened syntax for end note", () => {
    const result = linkFootnotes("$FN[foo] $foo");

    expect(result).toContain(
      '<a class="footnote" id="foo" href="#foo1">[1]</a>',
    );
  });

  it("numbers ref IDs", () => {
    const result = linkFootnotes("$FN[foo] $foo $foo");

    expect(result).toContain(
      '<a class="footnote" id="foo2" href="#foo">[1]</a>',
    );
  });

  it("increments visual ref identifier", () => {
    const result = linkFootnotes("$FN[foo] $foo $FN[bar] $bar");

    expect(result).toContain(
      '<a class="footnote" id="bar1" href="#bar">[2]</a>',
    );
  });

  it("handles footnote substring conflicts", () => {
    const result = linkFootnotes("$FN[DC] $DC2 $FN[DC2] $DC");

    expect(result).toContain('<a class="footnote" id="DC2" href="#DC21">');
  });

  it("orders end notes by appearance", () => {
    const result = linkFootnotes("$FN[a] $FN[bb] $FN[a]");

    expect(result).toContain('<a class="footnote" id="a" href="#a1">[1]</a>');
  });

  it("does not include extra square brackets", () => {
    const result = linkFootnotes("$FN[a] $FN[bb] $FN[a]");

    expect(result).not.toContain("</a>]");
  });

  it("does not trim content", () => {
    const result = linkFootnotes("$FN[a]abc$FN[a]");

    expect(result).toContain("abc");
  });

  it("does not lose commas", () => {
    const result = linkFootnotes("$DANNYDEEP, so we predict $FN[DANNYDEEP]");

    expect(result).toContain(",");
  });

  it("does not remove non-footnote square brackets", () => {
    const result = linkFootnotes("[$a] $FN[a]");

    expect(result).toContain("]");
  });

  it("does not duplicate footnote references", () => {
    const result = linkFootnotes("$a $FN[a]");

    expect(result).not.toContain("a2");
  });
});
