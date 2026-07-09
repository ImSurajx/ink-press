"use client";

import React from "react";
import { useEditorStore } from "@/lib/store/editor";
import { useThemeStore } from "@/lib/store/theme";

export default function PreviewPanel() {
  const { markdown } = useEditorStore();
  const { currentTheme } = useThemeStore();

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none bg-muted/40">
        <span>LIVE PREVIEW</span>
      </div>
      <div className="flex-1 w-full h-full overflow-y-auto p-6">
        <div id="ink-preview-container" className={`markdown-body theme-${currentTheme}`}>
          <pre className="whitespace-pre-wrap font-mono text-sm">{markdown}</pre>
        </div>
      </div>
    </div>
  );
}
