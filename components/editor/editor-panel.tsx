"use client";

import React, { useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef, EditorView } from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useEditorStore } from "@/lib/store/editor";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading,
  Link,
  Code,
  Image,
  Table,
  List,
  ListOrdered,
  CheckSquare,
  Scissors,
  Sigma,
} from "lucide-react";

export default function EditorPanel() {
  const { markdown, setMarkdown, setFileName } = useEditorStore();
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // Helper to insert markdown tags at selection
  const insertMarkdown = (before: string, after: string = "") => {
    const view = editorRef.current?.view;
    if (!view) return;

    view.focus();
    const { state, dispatch } = view;
    const selection = state.selection.main;
    const selectedText = state.sliceDoc(selection.from, selection.to);
    const replacement = `${before}${selectedText}${after}`;

    dispatch({
      changes: { from: selection.from, to: selection.to, insert: replacement },
      selection: {
        anchor: selection.from + before.length + (selectedText ? selectedText.length : 0),
      },
    });
  };

  // Drag and Drop File Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".markdown")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setMarkdown(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Bold (Ctrl+B)" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italic (Ctrl+I)" },
    { icon: Heading, action: () => insertMarkdown("## "), title: "Heading" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), title: "Link" },
    { icon: Code, action: () => insertMarkdown("`", "`"), title: "Inline Code" },
    { icon: Image, action: () => insertMarkdown("![alt](", ")"), title: "Image" },
    {
      icon: Table,
      action: () =>
        insertMarkdown("\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n"),
      title: "Table",
    },
    { icon: List, action: () => insertMarkdown("- "), title: "Unordered List" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), title: "Ordered List" },
    { icon: CheckSquare, action: () => insertMarkdown("- [ ] "), title: "Task List" },
    { icon: Sigma, action: () => insertMarkdown("$", "$"), title: "Math Equation" },
    {
      icon: Scissors,
      action: () => insertMarkdown("\n<div class=\"page-break-before\"></div>\n"),
      title: "Forced Page Break",
    },
  ];

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-col flex-1 h-full w-full bg-background border-r border-border overflow-hidden"
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-3 py-1.5 min-h-[38px] select-none">
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={btn.action}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title={btn.title}
            aria-label={btn.title}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* CodeMirror 6 Editor Container */}
      <div className="flex-1 w-full overflow-hidden text-sm relative">
        <CodeMirror
          ref={editorRef}
          value={markdown}
          onChange={(val) => setMarkdown(val)}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          extensions={[
            markdownLang({ codeLanguages: languages }),
            EditorView.lineWrapping,
          ]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            highlightActiveLine: false,
          }}
          className="h-full w-full codemirror-editor"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
