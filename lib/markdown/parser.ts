import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

// Custom Rehype plugin to extract Mermaid code blocks and wrap them
// in a clean <pre class="mermaid"> tag so client-side Mermaid can render them
function rehypeMermaid() {
  return (tree: any) => {
    traverse(tree);
  };

  function traverse(node: any) {
    if (node.type === "element" && node.tagName === "pre") {
      const codeNode = node.children?.[0];
      if (codeNode && codeNode.type === "element" && codeNode.tagName === "code") {
        const className = codeNode.properties?.className || [];
        if (className.includes("language-mermaid")) {
          // Transform <pre><code> to <div class="mermaid"> to bypass syntax highlight conflicts
          node.tagName = "div";
          node.properties = { className: ["mermaid"] };
          node.children = codeNode.children;
          return;
        }
      }
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
}

// Custom Rehype plugin to convert top-level <br> elements to page breaks
function rehypePageBreak() {
  return (tree: any) => {
    if (tree.type === "root" && tree.children) {
      tree.children = tree.children.map((node: any) => {
        if (
          (node.type === "element" && node.tagName === "br") ||
          (node.type === "raw" && /^\s*<br\s*\/?>\s*$/i.test(node.value))
        ) {
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["page-break-before"] },
            children: [],
          };
        }
        return node;
      });
    }
  };
}

export async function parseMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaid) // Handle Mermaid blocks before syntax highlighter
    .use(rehypePageBreak) // Convert top-level <br> tags to page breaks
    .use(rehypeKatex)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}
