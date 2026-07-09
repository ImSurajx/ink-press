import { create } from "zustand";

interface EditorState {
  markdown: string;
  fileName: string;
  wordCount: number;
  charCount: number;
  setMarkdown: (markdown: string) => void;
  setFileName: (fileName: string) => void;
  clearMarkdown: () => void;
}

const calculateWordCount = (text: string): number => {
  const cleanText = text.trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).length;
};

const defaultMarkdown = `# Welcome to ink-press

ink-press is a modern, open-source Markdown editor and PDF generator designed for developers, technical writers, and students.

## Features

- **Instant Live Preview**: See your rendered document updated in real-time as you type.
- **Math Equations**: Fully supported via KaTeX. Inline like $E = mc^2$ or blocks:
  
  $$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$

- **Mermaid Diagrams**: Render flowcharts, sequence diagrams, and more:

  \`\`\`mermaid
  graph TD
      A[Write Markdown] --> B(Live Preview)
      B --> C{Perfect PDF Export}
      C --> D[Vercel Serverless]
  \`\`\`

- **Tables & Lists**:
  
  | Feature | Status | Quality |
  | :--- | :--- | :--- |
  | GFM | Supported | High |
  | PDF | Vectorized | Pixel-Perfect |

- **Custom Themes**: Apply predefined stylesheets or write your own custom CSS in real-time.

---

Start editing this text or paste your own document!
`;

export const useEditorStore = create<EditorState>((set) => ({
  markdown: defaultMarkdown,
  fileName: "document.md",
  wordCount: calculateWordCount(defaultMarkdown),
  charCount: defaultMarkdown.length,
  setMarkdown: (markdown) => {
    set({
      markdown,
      wordCount: calculateWordCount(markdown),
      charCount: markdown.length,
    });
  },
  setFileName: (fileName) => {
    const formattedName = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
    set({ fileName: formattedName });
  },
  clearMarkdown: () => set({ markdown: "", wordCount: 0, charCount: 0 }),
}));
