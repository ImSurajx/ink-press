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

export default function Home() {
  const { activeTab } = useUIStore();
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
      {/* Mobile Screen Block Warning */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen w-full bg-slate-950 text-slate-100 p-6 font-sans">
        <div className="max-w-md w-full border border-slate-800/80 bg-slate-900/40 backdrop-blur-lg px-6 py-10 rounded-2xl shadow-2xl flex flex-col items-center text-center gap-6">
          <div className="h-14 w-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center rounded-2xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-bold tracking-tight">Desktop Screen Required</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              This application is not operational on mobile screens. If you want to use it, please open it on a laptop or desktop computer.
            </p>
          </div>
          <div className="h-[1px] w-1/2 bg-slate-800" />
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase select-none">
            ink-press workspace
          </span>
        </div>
      </div>

      {/* Desktop Workspace (hidden on mobile) */}
      <div className="hidden md:flex h-full w-full flex-col overflow-hidden">
        {/* Header Toolbar */}
        <Header />

        {/* Main Workspace Area */}
        <main className="flex flex-1 min-h-0 relative">
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
