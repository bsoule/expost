import { describe, it, expect } from "vitest";
import parse from "./parse.js";

describe("marked ids extension", () => {
  it("preserves HTML entities", () => {
    const r = parse(
      '```\n{#example} &lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;\n```'
    );

    expect(r).toContain('&lt;a id="foo1" href="#foo"&gt;[N]&lt;/a&gt;');
  });

  it("parses ~~ as strikethrough", () => {
    const r = parse("~~foo~~");

    expect(r).toContain("<del>foo</del>");
  });

  it("does not encode arrows in img tags", () => {
    const r = parse("![img](foo.png)");

    expect(r).toContain('<img src="foo.png" alt="img">');
  });

  it("does not encode linked img tags", () => {
    const r = parse("[![img](foo.png)](bar)");

    expect(r).toContain('<a href="bar"><img src="foo.png" alt="img"></a>');
  });

  it("does not encode comment with enpty lines", () => {
    const r = parse(`before
    <!--
  foo
  
  bar
  -->`);
    expect(r).not.toContain("&lt;!&#8212;");
  });
});
