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

function preprocessMarkdown(markdown: string): string {
  if (!markdown) return "";
  // Split the markdown by fenced code blocks (``` ... ```)
  const parts = markdown.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part) => {
    // If it is a fenced code block, do not replace inside it
    if (part.startsWith("```")) {
      return part;
    }
    
    // Split by inline code blocks (`...`)
    const inlineParts = part.split(/(`[^`\n]*?`)/g);
    return inlineParts.map((inlinePart) => {
      // If it is inline code, do not replace inside it
      if (inlinePart.startsWith("`")) {
        return inlinePart;
      }
      // Replace <br> and <br /> (case-insensitive) with block-level page breaks
      return inlinePart.replace(/<br\s*\/?>/gi, '\n\n<div class="page-break-before"></div>\n\n');
    }).join("");
  }).join("");
}

export async function parseMarkdown(markdown: string): Promise<string> {
  const preprocessed = preprocessMarkdown(markdown);
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
    .process(preprocessed);

  return String(file);
}
