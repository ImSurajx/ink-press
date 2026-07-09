"use client";

import React from "react";
import { useEditorStore } from "@/lib/store/editor";
import { useThemeStore } from "@/lib/store/theme";
import { useSettingsStore } from "@/lib/store/settings";
import { Info, Sparkles } from "lucide-react";

export default function StatusBar() {
  const { wordCount, charCount } = useEditorStore();
  const { currentTheme } = useThemeStore();
  const { pageSize, orientation } = useSettingsStore();

  return (
    <footer className="flex h-6 w-full items-center justify-between border-t border-border bg-background px-3 text-[11px] font-medium text-muted-foreground select-none">
      {/* Left: General Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          <span>ink-press engine active</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>{wordCount} words</span>
          <span className="h-2.5 w-[1px] bg-border" />
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Right: Selected Theme & Layout Page details */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5" title="Render Style">
          <span>Theme:</span>
          <span className="capitalize text-foreground font-semibold">{currentTheme}</span>
        </div>
        <span className="h-2.5 w-[1px] bg-border hidden md:block" />
        <div className="flex items-center gap-1.5" title="PDF Print Format">
          <Info className="h-3 w-3" />
          <span>Layout:</span>
          <span className="text-foreground font-semibold">
            {pageSize} ({orientation})
          </span>
        </div>
      </div>
    </footer>
  );
}
