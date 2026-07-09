"use client";

import React from "react";
import { useEditorStore } from "@/lib/store/editor";

export default function EditorPanel() {
  const { markdown, setMarkdown } = useEditorStore();

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background border-r border-border font-mono">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none bg-muted/40">
        <span>MARKDOWN EDITOR</span>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 w-full h-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none border-none"
        placeholder="Type your markdown here..."
      />
    </div>
  );
}
