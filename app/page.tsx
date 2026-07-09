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
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";

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

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground font-mono text-sm">
        Loading ink-press...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Header Toolbar */}
      <Header />

      {/* Main Workspace Area */}
      <main className="flex flex-1 min-h-0 relative">
        {/* Desktop Layout (hidden on mobile) */}
        <div className="hidden md:flex flex-1 min-h-0 w-full">
          <PanelGroup direction="horizontal" className="flex-1">
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

        {/* Mobile Layout (hidden on desktop) */}
        <div className="md:hidden flex flex-1 flex-col min-h-0 w-full">
          {activeTab === "editor" && <EditorPanel />}
          {activeTab === "preview" && <PreviewPanel />}
        </div>
      </main>

      {/* Footer Status Bar */}
      <StatusBar />

      {/* Page Export Settings Modal Pop-up */}
      <SettingsPanel />

      {/* Theme Custom CSS Editor Modal */}
      <CustomCSSDialog />
    </div>
  );
}
