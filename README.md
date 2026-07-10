# ink-press ✍️ — The Ultimate Online Markdown to PDF Converter

[![Live App](https://img.shields.io/badge/Live%20App-ink--press-blueviolet?style=for-the-badge&logo=vercel)](https://ink-press-navy.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[ink-press](https://ink-press-navy.vercel.app/)** is a production-grade, SEO-optimized, open-source online Markdown editor and high-fidelity PDF generator. It is designed to compile clean, beautiful, print-ready documents (notes, reports, slides, or academic papers) directly from your web browser with absolute pixel-perfect layout preservation.

Say goodbye to formatting headaches and layout shifting. With **ink-press**, what you see in the live preview is exactly what you get in your exported vector PDF.

👉 **Start converting now at [ink-press-navy.vercel.app](https://ink-press-navy.vercel.app/)**

---

## 🎯 Why Choose ink-press? (The Ultimate Markdown to PDF Solution)

When converting Markdown to PDF using traditional browser engines, pages shift, fonts distort, and tables split in half. **ink-press** solves this with a robust server-side headless browser engine paired with real-time page sheets emulation, giving you desktop-quality typesetting online.

### 1. 🖨️ Real-Time Page Sheets Emulation (True WYSIWYG)
Other editors render a continuous vertical scroll, leaving you guessing where page breaks will occur. **ink-press** calculates content heights dynamically based on standard print page sizes (A4, Letter, Legal, A3, A5) and overlays visual page boundary gaps. You see exactly where page breaks happen as you type!

### 2. ⚡ Custom Page Breaks via `<br>`
Want to force content to start on a fresh page? Simply type a standard HTML `<br>` or `<br />` tag anywhere in your editor. Our AST preprocessor intercepts it and translates it into a physical page-break element in both the screen preview and the final PDF export.

### 3. 📊 Seamless LaTeX Math & Mermaid Diagrams
* **Mathematical Notation**: Full, native KaTeX support. Render inline equations like $E = mc^2$ or block-level formulations like $\int_{a}^{b} f(x) \, dx = F(b) - F(a)$ instantly.
* **Mermaid Flowcharts**: Write native code blocks (` ```mermaid `) to draw flowcharts, state diagrams, and sequences. The exporter packages and injects styling to ensure diagrams render correctly in the final PDF.
* **Proportional Scaling**: Mermaid diagrams are automatically bounded so they fit perfectly within page margins without causing overflow or breaking across pages.

### 4. 📱 Responsive Mobile Layout & Toggle Support
Create and preview documents on the go. The interface scales cleanly to smartphones and tablets:
* Access the **Markdown Editor** or **Live PDF Preview** using a glassmorphic floating toggle button.
* Small viewports automatically scale the preview page using CSS `zoom: 0.46` to fit standard screens without reflowing the text, maintaining 100% parity with the desktop layout.
* Horizontal scrolling is disabled, keeping navigation focused and scroll movements strictly vertical.

### 5. 🎨 12+ Premium Typesetting Themes
Choose from professional layouts designed for various use cases, including:
* **GitHub Notes**: The classic, clean developer styling.
* **Ruled Notebook**: Simulates lined cream paper with continuous vertical red legal margin lines, perfect for handwritten-style notes.
* **Academic LaTeX Paper**: Elegant, double-column academic structure with classic serif fonts.
* **Retro Amber Terminal**: A glowing amber terminal monospace font configuration on an ultra-dark background.
* **Dracula Premium Dark**: Vibrant purple and green highlight colors optimized for nighttime writing.
* **Matrix Hacker Monospace**: Cyberpunk green-on-black terminal design.
* **Presentation Slide Deck**: Formatted blocks styled for slide layouts.
* **Custom CSS Editor**: Open the Custom CSS Compiler Dialog to write, preview, and apply your own styling overrides in real-time.

---

## 🛠️ High-Performance Tech Stack

* **Framework**: Next.js 15+ (App Router) & React 19+ (fully optimized for serverless deployments)
* **Text Editor**: CodeMirror 6 (with syntax highlighting, line numbers, and line wrapping)
* **Parser Pipeline**: Unified, Remark, Rehype, KaTeX, and Mermaid AST compilation
* **PDF Engine**: Server-side Headless Chromium (Puppeteer-core) configured at exact `96 DPI` resolution to eliminate layout offset distortions
* **State Management**: Zustand (lightweight client-side store)

---

## 📁 Repository Map

```text
ink-press/
├── app/                  # Next.js page views and API Route Handlers
│   ├── api/export/       # Puppeteer server-side PDF generation endpoint
│   ├── globals.css       # Tailwind base editor styles
│   └── page.tsx          # Main workspace shell with resizing panels
├── components/           # React UI components
│   ├── editor/           # Advanced CodeMirror editor panel & toolbar
│   ├── preview/          # Live HTML preview & auto-pagination hook
│   ├── settings/         # Page size & margin configuration dialog
│   └── themes/           # Custom CSS compiler dialog
├── lib/                  # State stores & parser utility pipelines
│   ├── markdown/         # AST unified parser pipeline & unit tests
│   └── store/            # Editor, Settings, and UI stores
└── styles/               # CSS themes stylesheets (GitHub, Notebook, Hacker, etc.)
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by [ImSurajx](https://github.com/ImSurajx). If you find this project useful, please consider giving it a ⭐ on GitHub!*