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
          // Transform <pre><code> to <pre class="mermaid">
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

export async function parseMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaid) // Handle Mermaid blocks before syntax highlighter
    .use(rehypeKatex)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}
