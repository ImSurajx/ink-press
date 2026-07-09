"use client";

import React, { useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store/editor";
import { useThemeStore } from "@/lib/store/theme";
import { parseMarkdown } from "@/lib/markdown/parser";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

export default function PreviewPanel() {
  const { markdown } = useEditorStore();
  const { currentTheme, customCSS } = useThemeStore();
  const { resolvedTheme } = useTheme();
  const [renderedHtml, setRenderedHtml] = useState("");

  // Debounced parsing to prevent keyboard rendering lag on large documents
  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const html = await parseMarkdown(markdown);
        setRenderedHtml(html);
      } catch (err) {
        console.error("Markdown parsing error:", err);
      }
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [markdown]);

  // Mermaid rendering pipeline
  useEffect(() => {
    if (!renderedHtml) return;

    const renderMermaid = async () => {
      try {
        // Re-initialize mermaid with current theme parameters
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "loose",
          themeVariables: {
            background: resolvedTheme === "dark" ? "#0f172a" : "#ffffff",
            primaryColor: resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9",
          },
        });

        const elements = document.querySelectorAll(".mermaid");
        if (elements.length > 0) {
          // Reset data-processed attributes so Mermaid re-compiles the elements
          elements.forEach((el) => {
            el.removeAttribute("data-processed");
          });
          await mermaid.run({
            querySelector: ".mermaid",
          });
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
      }
    };

    renderMermaid();
  }, [renderedHtml, resolvedTheme]);

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background overflow-hidden relative">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none bg-muted/40">
        <span>LIVE PREVIEW</span>
      </div>

      {/* Rendered HTML Container */}
      <div className="flex-1 w-full h-full overflow-y-auto p-6 scroll-smooth bg-background">
        {/* Custom CSS overrides injected directly */}
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />

        <div
          id="ink-preview-container"
          className={`markdown-body theme-${currentTheme} min-h-full`}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </div>
  );
}
