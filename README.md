# ink-press

`ink-press` is a production-grade, open-source Markdown editor and PDF generator with instant live preview, customizable CSS themes, and pixel-perfect PDF exports.

## Tech Stack

- **Framework**: Next.js 15+ (App Router) & React 19+
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **State Management**: Zustand
- **Editor Engine**: CodeMirror 6
- **Markdown AST Pipeline**: Unified, Remark, Rehype, KaTeX, and Mermaid
- **PDF Exporter**: Playwright & Headless Chromium

## Project Structure

```
ink-press/
├── app/                  # Next.js pages and API routes
├── components/           # React UI components
│   ├── editor/           # Markdown editor and toolbars
│   ├── preview/          # Live HTML and PDF preview
│   ├── settings/         # Page size and print settings
│   └── ui/               # Reusable shadcn primitives
├── lib/                  # Shared Zustand stores, parsers, and utilities
└── styles/               # CSS themes (GitHub, Minimalist, Academic, etc.)
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.