"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store/theme";
import { useUIStore } from "@/lib/store/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Helper to construct custom theme CSS variable template based on selected theme
const getThemeTemplateCSS = (theme: string): string => {
  const variablesMap: Record<string, string> = {
    github: `  --theme-background: #ffffff;
  --theme-foreground: #2d3748;
  --theme-heading: #1a202c;
  --theme-border: #e2e8f0;
  --theme-muted: #718096;
  --theme-link: #3182ce;
  --theme-quote-border: #3182ce;
  --theme-quote-bg: #f7fafc;
  --theme-table-header-bg: #edf2f7;
  --theme-table-zebra-bg: #f7fafc;
  --theme-code-bg: #f7fafc;
  --theme-code-color: #2d3748;
  --theme-code-block-bg: #f7fafc;
  --theme-mermaid-bg: #ffffff;`,
    "code-notes": `  --theme-background: #fbfbf8;
  --theme-foreground: #2d3748;
  --theme-heading: #1a202c;
  --theme-border: #e2e8f0;
  --theme-muted: #718096;
  --theme-link: #3182ce;
  --theme-quote-border: #3182ce;
  --theme-quote-bg: #edf2f7;
  --theme-table-header-bg: #edf2f7;
  --theme-table-zebra-bg: #f7fafc;
  --theme-code-bg: #edf2f7;
  --theme-code-color: #e53e3e;
  --theme-code-block-bg: #1a202c;
  --theme-mermaid-bg: #ffffff;`,
    mathematics: `  --theme-background: #fdfdfb;
  --theme-foreground: #1c1c1c;
  --theme-heading: #0f1c30;
  --theme-border: #7f8c8d;
  --theme-muted: #555555;
  --theme-link: #1b4f72;
  --theme-quote-border: #0f1c30;
  --theme-quote-bg: #f5f6f8;
  --theme-table-header-bg: #e5e8e8;
  --theme-table-zebra-bg: #fdfdfb;
  --theme-code-bg: #eaeded;
  --theme-code-color: #78281f;
  --theme-code-block-bg: #fcfcfc;
  --theme-mermaid-bg: #ffffff;`,
    physics: `  --theme-background: #f4f7f6;
  --theme-foreground: #2c3e50;
  --theme-heading: #1a252f;
  --theme-border: #bdc3c7;
  --theme-muted: #7f8c8d;
  --theme-link: #2980b9;
  --theme-quote-border: #2980b9;
  --theme-quote-bg: #ebf5fb;
  --theme-table-header-bg: #d5dbdb;
  --theme-table-zebra-bg: #eaecee;
  --theme-code-bg: #e5e8e8;
  --theme-code-color: #c0392b;
  --theme-code-block-bg: #1c2833;
  --theme-mermaid-bg: #ffffff;`,
    chemistry: `  --theme-background: #fafdfc;
  --theme-foreground: #2f4f4f;
  --theme-heading: #0f3d3d;
  --theme-border: #ccd9d9;
  --theme-muted: #668c8c;
  --theme-link: #008080;
  --theme-quote-border: #008080;
  --theme-quote-bg: #e6f2f2;
  --theme-table-header-bg: #e6f2f2;
  --theme-table-zebra-bg: #f2f9f9;
  --theme-code-bg: #e6f2f2;
  --theme-code-color: #99004d;
  --theme-code-block-bg: #1f3030;
  --theme-mermaid-bg: #ffffff;`,
    biology: `  --theme-background: #fcfdfa;
  --theme-foreground: #2d382d;
  --theme-heading: #1e3f20;
  --theme-border: #d4dfd4;
  --theme-muted: #5e7a5e;
  --theme-link: #3b7a3b;
  --theme-quote-border: #3b7a3b;
  --theme-quote-bg: #f2f7f2;
  --theme-table-header-bg: #e2ede2;
  --theme-table-zebra-bg: #f5f9f5;
  --theme-code-bg: #f2f7f2;
  --theme-code-color: #8b4513;
  --theme-code-block-bg: #273627;
  --theme-mermaid-bg: #ffffff;`,
    "academic-paper": `  --theme-background: #ffffff;
  --theme-foreground: #000000;
  --theme-heading: #000000;
  --theme-border: #000000;
  --theme-muted: #555555;
  --theme-link: #0000ee;
  --theme-quote-border: #555555;
  --theme-quote-bg: #f9f9f9;
  --theme-table-header-bg: #f2f2f2;
  --theme-table-zebra-bg: #ffffff;
  --theme-code-bg: #eaeaea;
  --theme-code-color: #000000;
  --theme-code-block-bg: #fafafa;
  --theme-mermaid-bg: #ffffff;`,
    minimal: `  --theme-background: #ffffff;
  --theme-foreground: #111111;
  --theme-heading: #111111;
  --theme-border: #e5e5e5;
  --theme-muted: #666666;
  --theme-link: #000000;
  --theme-quote-border: #000000;
  --theme-quote-bg: #fafafa;
  --theme-table-header-bg: #fafafa;
  --theme-table-zebra-bg: #ffffff;
  --theme-code-bg: #f5f5f5;
  --theme-code-color: #111111;
  --theme-code-block-bg: #fafafa;
  --theme-mermaid-bg: #ffffff;`,
    notebook: `  --theme-background: #fffdf5;
  --theme-foreground: #2b2b2a;
  --theme-heading: #111111;
  --theme-border: #ccd6dd;
  --theme-muted: #657786;
  --theme-link: #ff4500;
  --theme-quote-border: #ff4500;
  --theme-quote-bg: #fffbf0;
  --theme-table-header-bg: #f5f8fa;
  --theme-table-zebra-bg: #fffdf5;
  --theme-code-bg: #f5f8fa;
  --theme-code-color: #ff4500;
  --theme-code-block-bg: #ffffff;
  --theme-mermaid-bg: #ffffff;`,
    "elegant-book": `  --theme-background: #fcf8f2;
  --theme-foreground: #3c3c3c;
  --theme-heading: #1e1e1e;
  --theme-border: #e8e2d5;
  --theme-muted: #7d7568;
  --theme-link: #8c6d48;
  --theme-quote-border: #8c6d48;
  --theme-quote-bg: #f9f5ed;
  --theme-table-header-bg: #f2ebd9;
  --theme-table-zebra-bg: #f9f5ed;
  --theme-code-bg: #f2ebd9;
  --theme-code-color: #8c6d48;
  --theme-code-block-bg: #fcf8f2;
  --theme-mermaid-bg: #ffffff;`,
    hacker: `  --theme-background: #000000;
  --theme-foreground: #00ff00;
  --theme-heading: #00ff00;
  --theme-border: #00ff00;
  --theme-muted: #008800;
  --theme-link: #00ffff;
  --theme-quote-border: #00ff00;
  --theme-quote-bg: #051505;
  --theme-table-header-bg: #051505;
  --theme-table-zebra-bg: #000000;
  --theme-code-bg: #051505;
  --theme-code-color: #00ffff;
  --theme-code-block-bg: #020b02;
  --theme-mermaid-bg: #000000;`,
    presentation: `  --theme-background: #ffffff;
  --theme-foreground: #1e293b;
  --theme-heading: #0f172a;
  --theme-border: #cbd5e1;
  --theme-muted: #64748b;
  --theme-link: #2563eb;
  --theme-quote-border: #2563eb;
  --theme-quote-bg: #f8fafc;
  --theme-table-header-bg: #f1f5f9;
  --theme-table-zebra-bg: #f8fafc;
  --theme-code-bg: #f1f5f9;
  --theme-code-color: #2563eb;
  --theme-code-block-bg: #0f172a;
  --theme-mermaid-bg: #ffffff;`,
    dark: `  --theme-background: #0f172a;
  --theme-foreground: #cbd5e1;
  --theme-heading: #f8fafc;
  --theme-border: #334155;
  --theme-muted: #94a3b8;
  --theme-link: #38bdf8;
  --theme-quote-border: #38bdf8;
  --theme-quote-bg: #1e293b;
  --theme-table-header-bg: #1e293b;
  --theme-table-zebra-bg: #1e293b;
  --theme-code-bg: #1e293b;
  --theme-code-color: #cbd5e1;
  --theme-code-block-bg: #0b0f19;
  --theme-mermaid-bg: #0f172a;`
  };

  const variables = variablesMap[theme] || variablesMap.github;

  return `/* Custom CSS Override
   Template pre-populated from: ${theme.toUpperCase()} theme
   Modify variables below to customize your note sheet!
*/

.markdown-body {
${variables}
}
`;
};

export default function CustomCSSDialog() {
  const { customCSS, setCustomCSS, previousTheme } = useThemeStore();
  const { isCustomCSSOpen, setCustomCSSOpen } = useUIStore();
  const [localCSS, setLocalCSS] = useState(customCSS);

  // When opening the dialog, check if customCSS is still using the default generic template.
  // If it is, automatically pre-populate the editor with the variables of the active previousTheme!
  useEffect(() => {
    if (isCustomCSSOpen) {
      const defaultGenericCSS = `/* Custom Stylesheet
   Write custom CSS styles here to override theme variables.
   All styles apply instantly to both live preview and PDF.
*/

.markdown-body {
  /* Customize font family */
  /* font-family: 'Courier New', Courier, monospace; */
}
`;
      if (customCSS === defaultGenericCSS) {
        setLocalCSS(getThemeTemplateCSS(previousTheme));
      } else {
        setLocalCSS(customCSS);
      }
    }
  }, [isCustomCSSOpen, customCSS, previousTheme]);

  const handleSave = () => {
    setCustomCSS(localCSS);
    setCustomCSSOpen(false);
  };

  const handleReset = () => {
    if (confirm(`Reset custom CSS to the default variables template for the ${previousTheme.toUpperCase()} theme?`)) {
      setLocalCSS(getThemeTemplateCSS(previousTheme));
    }
  };

  return (
    <Dialog open={isCustomCSSOpen} onOpenChange={setCustomCSSOpen}>
      <DialogContent className="max-w-2xl w-[90vw] h-[80vh] flex flex-col p-6 bg-background border border-border rounded-lg shadow-xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-md font-semibold text-foreground">Edit Custom CSS</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Custom styles will apply instantly to the editor live preview and the exported PDF.
          </DialogDescription>
        </DialogHeader>

        {/* CSS Text Editor Area */}
        <div className="flex-1 min-h-0 py-4">
          <Textarea
            value={localCSS}
            onChange={(e) => setLocalCSS(e.target.value)}
            className="w-full h-full min-h-[300px] font-mono text-xs p-4 leading-relaxed resize-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 bg-muted/20 border-border text-foreground"
            placeholder="/* Write custom CSS overrides here */"
          />
        </div>

        <DialogFooter className="flex-shrink-0 flex items-center justify-between gap-2 sm:justify-between">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            Reset to Theme Template
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCustomCSSOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} className="text-xs">
              Apply Styles
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
