"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/layout/header";
import StatusBar from "@/components/layout/status-bar";
import EditorPanel from "@/components/editor/editor-panel";
import PreviewPanel from "@/components/preview/preview-panel";
import SettingsPanel from "@/components/settings/settings-panel";
import CustomCSSDialog from "@/components/themes/custom-css-dialog";
import { useUIStore } from "@/lib/store/ui";
import { useEditorStore } from "@/lib/store/editor";
import { useSettingsStore } from "@/lib/store/settings";
import { useThemeStore } from "@/lib/store/theme";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { FileCode, Eye } from "lucide-react";

export default function Home() {
  const { activeTab, setActiveTab } = useUIStore();
  const { markdown, setMarkdown, fileName, setFileName } = useEditorStore();
  const { pageSize, setPageSize, orientation, setOrientation } = useSettingsStore();
  const { currentTheme, setCurrentTheme, customCSS, setCustomCSS } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Restore states from localStorage if available
    try {
      const savedMarkdown = localStorage.getItem("ink-press-markdown");
      const savedFileName = localStorage.getItem("ink-press-filename");
      const savedPageSize = localStorage.getItem("ink-press-pagesize");
      const savedOrientation = localStorage.getItem("ink-press-orientation");
      const savedTheme = localStorage.getItem("ink-press-theme");
      const savedCustomCSS = localStorage.getItem("ink-press-customcss");

      if (savedMarkdown !== null) setMarkdown(savedMarkdown);
      if (savedFileName !== null) setFileName(savedFileName);
      if (savedPageSize !== null) setPageSize(savedPageSize as any);
      if (savedOrientation !== null) setOrientation(savedOrientation as any);
      if (savedTheme !== null) setCurrentTheme(savedTheme as any);
      if (savedCustomCSS !== null) setCustomCSS(savedCustomCSS);
    } catch (e) {
      console.error("Failed to restore state from localStorage:", e);
    }
  }, []);

  // Save changes to localStorage dynamically
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-markdown", markdown);
  }, [markdown, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-filename", fileName);
  }, [fileName, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-pagesize", pageSize);
  }, [pageSize, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-orientation", orientation);
  }, [orientation, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-theme", currentTheme);
  }, [currentTheme, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("ink-press-customcss", customCSS);
  }, [customCSS, isMounted]);

  // Global accessibility keyboard controls (Ctrl+S / Cmd+S to save MD, Ctrl+P / Cmd+P to export PDF)
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (!isMeta) return;

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          // Trigger standard Markdown download trigger
          const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        case "p":
          e.preventDefault();
          // Dispatch custom event to trigger playwright generation
          window.dispatchEvent(new CustomEvent("ink-trigger-pdf-export"));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [markdown, fileName, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground font-mono text-sm">
        Loading ink-press...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Workspace Wrapper */}
      <div className="flex h-full w-full flex-col overflow-hidden">
        {/* Header Toolbar */}
        <Header />

        {/* Main Workspace Area */}
        <main className="flex flex-1 min-h-0 relative">
          {/* Desktop Layout (Split Screen) */}
          <div className="hidden md:flex flex-1 h-full w-full">
            <PanelGroup orientation="horizontal" className="flex-1">
              {/* Left Panel: Markdown Editor */}
              <Panel defaultSize={50} minSize={25}>
                <EditorPanel />
              </Panel>

              {/* Resizable Divider */}
              <PanelResizeHandle className="w-1.5 hover:w-2 bg-border hover:bg-primary/20 transition-all cursor-col-resize flex-shrink-0" />

              {/* Right Panel: Live HTML Preview */}
              <Panel defaultSize={50} minSize={25}>
                <PreviewPanel />
              </Panel>
            </PanelGroup>
          </div>

          {/* Mobile Layout (Toggle Views) */}
          <div className="flex md:hidden flex-1 h-full w-full relative overflow-hidden">
            {activeTab === "preview" ? (
              <div className="flex-1 h-full w-full overflow-y-auto">
                <PreviewPanel />
              </div>
            ) : (
              <div className="flex-1 h-full w-full">
                <EditorPanel />
              </div>
            )}
          </div>

          {/* Floating Mobile Toggle Button */}
          <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-border/80 bg-background/85 p-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeTab === "editor"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview (PDF)
            </button>
          </div>
        </main>

        {/* Footer Status Bar */}
        <StatusBar />

        {/* Page Export Settings Modal Pop-up */}
        <SettingsPanel />

        {/* Theme Custom CSS Editor Modal */}
        <CustomCSSDialog />
      </div>
    </div>
  );
}
