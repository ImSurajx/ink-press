"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditorStore } from "@/lib/store/editor";
import { useThemeStore } from "@/lib/store/theme";
import { parseMarkdown } from "@/lib/markdown/parser";
import { useSettingsStore } from "@/lib/store/settings";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

export default function PreviewPanel() {
  const { markdown } = useEditorStore();
  const { currentTheme, customCSS } = useThemeStore();
  const { marginType, pageSize } = useSettingsStore();
  const { resolvedTheme } = useTheme();
  const [renderedHtml, setRenderedHtml] = useState("");

  const getMarginPadding = () => {
    switch (marginType) {
      case "none":
        return "0px";
      case "minimum":
        return "10mm";
      case "normal":
      default:
        return "20mm";
    }
  };

  const getPageWidth = () => {
    switch (pageSize) {
      case "Letter":
      case "Legal":
        return "816px";
      case "A3":
        return "1123px";
      case "A5":
        return "559px";
      case "A4":
      default:
        return "794px";
    }
  };

  const getPageHeightPx = () => {
    switch (pageSize) {
      case "Letter": return 1056;
      case "Legal": return 1344;
      case "A3": return 1587;
      case "A5": return 794;
      case "A4":
      default: return 1123;
    }
  };

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

  const renderingRef = useRef(false);
  const pendingRef = useRef(false);

  // Initialize Mermaid once on mount and theme change
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        themeVariables: {
          background: resolvedTheme === "dark" ? "#0f172a" : "#ffffff",
          primaryColor: resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9",
        },
      });
    } catch (err) {
      console.error("Mermaid initialization error:", err);
    }
  }, [resolvedTheme]);

  // Synchronized rendering pipeline to prevent race conditions during fast typing
  useEffect(() => {
    if (!renderedHtml) return;

    const runMermaidRender = async () => {
      if (renderingRef.current) {
        pendingRef.current = true;
        return;
      }

      renderingRef.current = true;
      pendingRef.current = false;

      try {
        const elements = document.querySelectorAll(".mermaid");
        if (elements.length > 0) {
          // Backup the raw code and reset the elements cleanly before compilation
          elements.forEach((el) => {
            const rawCode = el.getAttribute("data-mermaid-src") || el.textContent || "";
            if (!el.getAttribute("data-mermaid-src")) {
              el.setAttribute("data-mermaid-src", rawCode);
            }
            el.textContent = rawCode;
            el.removeAttribute("data-processed");
          });

          await mermaid.run({
            querySelector: ".mermaid",
          });
        }
      } catch (err) {
        console.error("Mermaid run error:", err);
      } finally {
        renderingRef.current = false;
        if (pendingRef.current) {
          setTimeout(runMermaidRender, 0);
        }
      }
    };

    runMermaidRender();
  }, [renderedHtml]);

  // Dynamic automatic page break annotation based on page size and content heights
  useEffect(() => {
    if (!renderedHtml) return;

    const runPagination = () => {
      const container = document.getElementById("ink-preview-container");
      if (!container) return;

      const children = Array.from(container.children);
      if (children.length === 0) return;

      const targetPageHeight = getPageHeightPx() - 76; // 76px buffer (1cm top + 1cm bottom margins)
      let currentHeight = 0;

      // Temporarily strip auto-page-break to measure natural margins & heights accurately
      children.forEach((child: any) => {
        child.classList.remove("auto-page-break");
      });

      children.forEach((child: any) => {
        if (child.tagName === "STYLE" || child.style.display === "none") return;

        if (child.classList.contains("page-break-before")) {
          child.classList.add("auto-page-break");
          currentHeight = 0;
          return;
        }

        const h = child.offsetHeight;
        const styles = window.getComputedStyle(child);
        const marginTop = parseFloat(styles.marginTop) || 0;
        const marginBottom = parseFloat(styles.marginBottom) || 0;
        const totalHeight = h + marginTop + marginBottom;

        if (currentHeight + totalHeight > targetPageHeight) {
          child.classList.add("auto-page-break");
          currentHeight = totalHeight;
        } else {
          currentHeight += totalHeight;
        }
      });
    };

    const timer = setTimeout(runPagination, 250);
    return () => clearTimeout(timer);
  }, [renderedHtml, pageSize]);

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background overflow-hidden relative">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none bg-muted/40">
        <span>LIVE PREVIEW</span>
      </div>

      {/* Rendered HTML Container */}
      <div className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto p-4 md:p-6 scroll-smooth bg-background flex flex-col items-center">
        {/* Custom CSS overrides injected directly */}
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />

        <div
          id="ink-preview-container"
          className={`markdown-body theme-${currentTheme} mx-auto shadow-sm border border-border rounded-sm transition-all duration-300 flex-shrink-0`}
          style={{
            padding: getMarginPadding(),
            width: getPageWidth(),
            minWidth: getPageWidth(),
            minHeight: getPageHeightPx(),
          }}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </div>
  );
}
