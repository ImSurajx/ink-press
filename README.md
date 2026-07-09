# ink-press ✍️

`ink-press` is a production-grade, open-source Markdown editor and PDF generator featuring real-time live preview, dynamic page sheets emulation, custom CSS styling, and pixel-perfect vector PDF exports. 

It is designed for technical writers, researchers, students, and developers who need to compile clean, beautiful notes, reports, slides, or academic papers directly to printable documents.

---

## 🚀 Key Features

*   **Interactive Live Preview**: Split-pane layout with instant rendering synchronization as you type.
*   **Dynamic Page Sheets Emulation**: Calculates content heights in real-time based on selected page sizes (A4, Letter, Legal, etc.) and overlays visual page gaps showing exactly where page-breaks will occur.
*   **High-Fidelity PDF Export**: Powered by server-side Playwright & Headless Chromium contexts configured at exact `96 DPI` resolution to eliminate layout offset distortions.
*   **Math Equations & Diagrams**: Full native support for LaTeX/KaTeX math formula blocks and Mermaid charts/diagrams.
*   **Extensive Themes Collection**: 10+ built-in stylesheets including:
    *   *GitHub Notes* (Standard clean markdown)
    *   *Ruled Notebook* (Cream paper with horizontal lines and red legal margins spanning margins continuously)
    *   *Academic LaTeX Paper* (Standard double-column paper structure)
    *   *Matrix Hacker Monospace* (Green-on-black terminal design)
    *   *Presentation Slide Deck* (Formatted slides)
*   **Real-time Custom CSS override**: Dialog compiler to inject customized CSS variable declarations or overrides.
*   **Client-Side Auto-Save**: Automatic state persistence to `localStorage` for open document markdown texts, filenames, and settings configurations.
*   **Accessibility Shortcuts**: Keyboard bindings (`Ctrl/Cmd+S` to download markdown, `Ctrl/Cmd+P` to export PDF) and ARIA support.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 15+ (App Router) & React 19+
*   **Styling**: Tailwind CSS v4, shadcn/ui & Vanilla CSS themes
*   **State Management**: Zustand
*   **Editor Engine**: CodeMirror 6 (with syntax highlighting and line wrapping)
*   **Markdown AST Pipeline**: Unified, Remark, Rehype, KaTeX, and Mermaid
*   **PDF Exporter**: Playwright & Headless Chromium

---

## 📁 Project Structure

```text
ink-press/
├── app/                  # Next.js page views and API Route Handlers
│   ├── api/export/       # Playwright PDF rendering endpoint
│   ├── globals.css       # Tailwind imports and base editor styles
│   └── page.tsx          # Main workspace shell with resizing panels
├── components/           # React UI components
│   ├── editor/           # Advanced CodeMirror editor panel & toolbar
│   ├── preview/          # Live HTML preview & auto-pagination hook
│   ├── settings/         # Sidebar settings panel
│   └── themes/           # Custom CSS compiler dialog
├── lib/                  # Shared Zustand state stores & utilities
│   ├── markdown/         # AST unified parser pipeline & unit tests
│   └── store/            # Editor, Settings, and UI stores
└── styles/               # CSS themes stylesheets (GitHub, Notebook, Hacker, etc.)
```

---

## 💻 Getting Started

### Prerequisites

*   Node.js 18.0 or higher
*   NPM or Yarn package manager

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/ImSurajx/ink-press.git
   cd ink-press
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🧪 Testing

The project uses **Vitest** to run high-performance unit test suites verifying the unified Markdown AST compilation pipeline.

To execute the unit tests:
```bash
npm run test
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.