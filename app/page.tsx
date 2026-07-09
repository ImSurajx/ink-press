"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/layout/header";
import StatusBar from "@/components/layout/status-bar";
import EditorPanel from "@/components/editor/editor-panel";
import PreviewPanel from "@/components/preview/preview-panel";
import SettingsPanel from "@/components/settings/settings-panel";
import CustomCSSDialog from "@/components/themes/custom-css-dialog";
import { useUIStore } from "@/lib/store/ui";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";

export default function Home() {
  const { isSidebarOpen, setSidebarOpen, activeTab } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);
  const settingsPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Synchronize settings panel expansion/collapse with UI Zustand store toggles
  useEffect(() => {
    if (!isMounted) return;
    const panel = settingsPanelRef.current;
    if (panel) {
      if (isSidebarOpen) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  }, [isSidebarOpen, isMounted]);

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
            {/* Main Area: Editor + Preview split (always 50-50 relative to each other) */}
            <Panel defaultSize={80} minSize={60}>
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
            </Panel>

            {/* Settings Sidebar (Collapsible Panel) */}
            {isSidebarOpen && (
              <PanelResizeHandle className="w-1.5 hover:w-2 bg-border hover:bg-primary/20 transition-all cursor-col-resize flex-shrink-0" />
            )}
            <Panel
              ref={settingsPanelRef}
              collapsible={true}
              defaultSize={isSidebarOpen ? 20 : 0}
              minSize={15}
              maxSize={35}
              onResize={(size) => {
                if (size === 0 && isSidebarOpen) {
                  setSidebarOpen(false);
                } else if (size > 0 && !isSidebarOpen) {
                  setSidebarOpen(true);
                }
              }}
            >
              {isSidebarOpen && <SettingsPanel />}
            </Panel>
          </PanelGroup>
        </div>

        {/* Mobile Layout (hidden on desktop) */}
        <div className="md:hidden flex flex-1 flex-col min-h-0 w-full">
          {activeTab === "editor" && <EditorPanel />}
          {activeTab === "preview" && <PreviewPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </main>

      {/* Footer Status Bar */}
      <StatusBar />

      {/* Theme Custom CSS Editor Modal */}
      <CustomCSSDialog />
    </div>
  );
}
