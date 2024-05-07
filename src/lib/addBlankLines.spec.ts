import addBlankLines from "./addBlankLines.js";
import { describe, it, expect } from "vitest";

describe("addBlankLines", () => {
  it("adds blank lines", () => {
    const markdown = "<h1>heading</h1>\nparagraph";

    const result = addBlankLines(markdown);

    expect(result).toEqual("<h1>heading</h1>\n\nparagraph");
  });

  it("adds blank lines after any html element", () => {
    const markdown = "<div>hello</div>\nparagraph";

    const result = addBlankLines(markdown);

    expect(result).toEqual("<div>hello</div>\n\nparagraph");
  });

  it("does not add blank lines after inline elements", () => {
    const markdown = "<div><span>hello</span></div>\nparagraph";

    const result = addBlankLines(markdown);

    expect(result).toEqual("<div><span>hello</span></div>\n\nparagraph");
  });

  it("does not add blank lines after anchor elements", () => {
    const markdown = '<a href="#">hello</a>\nparagraph';

    const result = addBlankLines(markdown);

    expect(result).toEqual('<a href="#">hello</a>\nparagraph');
  });

  it("adds blank lines after html with a space at end", () => {
    const markdown = "<h4>title</h4> \nparagraph";

    const result = addBlankLines(markdown);

    expect(result).toEqual("<h4>title</h4>\n\nparagraph");
  });
});
