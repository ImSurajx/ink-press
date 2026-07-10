import { describe, it, expect } from "vitest";
import { parseMarkdown } from "./parser";

describe("Markdown Parser Pipeline", () => {
  it("should compile standard headers and paragraphs to HTML", async () => {
    const markdown = "# Test Title\nHello world";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("<h1");
    expect(result).toContain("id=\"test-title\"");
    expect(result).toContain("Hello world");
  });

  it("should parse math equations correctly with KaTeX support", async () => {
    const markdown = "Einstein equation is $E = mc^2$";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("katex");
    expect(result).toContain("mc^2");
  });

  it("should isolate Mermaid diagram code blocks into a simple div container", async () => {
    const markdown = "```mermaid\ngraph TD\n  A --> B\n```";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("<div class=\"mermaid\">");
    expect(result).not.toContain("<pre><code");
  });

  it("should support GFM strike-through tag compilations", async () => {
    const markdown = "This is ~~deleted~~ text";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("<del>deleted</del>");
  });

  it("should convert top-level <br> tags to page-break-before divs", async () => {
    const markdown = "Hello\n\n<br>\n\nWorld";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("<div class=\"page-break-before\"></div>");
  });

  it("should convert inline <br> tags to page-break-before divs by splitting paragraphs", async () => {
    const markdown = "Hello <br> World";
    const result = await parseMarkdown(markdown);
    expect(result).toContain("<div class=\"page-break-before\"></div>");
    expect(result).toContain("<p>Hello </p>");
    expect(result).toContain("<p> World</p>");
  });
});
