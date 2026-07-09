"use client";

import React, { useRef } from "react";
import { useEditorStore } from "@/lib/store/editor";
import { useThemeStore, ThemeType } from "@/lib/store/theme";
import { useUIStore } from "@/lib/store/ui";
import { useSettingsStore } from "@/lib/store/settings";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Settings,
  Download,
  Upload,
  FileCode,
  Moon,
  Sun,
  RefreshCw,
  Sparkles,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Header() {
  const { fileName, setFileName, markdown, setMarkdown, clearMarkdown } = useEditorStore();
  const { currentTheme, setCurrentTheme, resetTheme, customCSS } = useThemeStore();
  const { isSidebarOpen, setSidebarOpen, isExporting, setExporting, activeTab, setActiveTab, setCustomCSSOpen } = useUIStore();
  const { pageSize } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHTML = () => {
    const previewContainer = document.getElementById("ink-preview-container");
    if (!previewContainer) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName.replace(".md", "")}</title>
  <style>
    /* Injected theme CSS */
    ${Array.from(document.querySelectorAll("style"))
      .map((s) => s.innerHTML)
      .join("\n")}
  </style>
</head>
<body class="markdown-body theme-${currentTheme}">
  ${previewContainer.innerHTML}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName.replace(".md", ".html"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdown(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const triggerPDFExport = async () => {
    const previewContainer = document.getElementById("ink-preview-container");
    if (!previewContainer) {
      alert("Error: Preview container not found.");
      return;
    }

    setExporting(true);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: previewContainer.innerHTML,
          theme: currentTheme,
          customCSS,
          pageSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Download the PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const downloadName = fileName.endsWith(".md") 
        ? fileName.replace(".md", ".pdf") 
        : `${fileName}.pdf`;
      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error("PDF Export Error:", error);
      alert(`Export failed: ${error.message || error}`);
    } finally {
      setExporting(false);
    }
  };

  const themes: { value: ThemeType; label: string }[] = [
    { value: "github", label: "GitHub Notes" },
    { value: "code-notes", label: "Code Notes (Comic Neue)" },
    { value: "mathematics", label: "Mathematics Textbook" },
    { value: "physics", label: "Physics Lecture Notes" },
    { value: "chemistry", label: "Chemistry Lab Notes" },
    { value: "biology", label: "Biology Notebook" },
    { value: "academic-paper", label: "Academic LaTeX Paper" },
    { value: "minimal", label: "Minimalist" },
    { value: "notebook", label: "Ruled Notebook" },
    { value: "elegant-book", label: "Elegant Book Sepia" },
    { value: "hacker", label: "Matrix Hacker Monospace" },
    { value: "presentation", label: "Presentation Slide Deck" },
    { value: "dark", label: "Dark Mode" },
    { value: "custom", label: "Custom CSS Override" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md">
      {/* Left: Branding & File details */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-foreground select-none">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">ink-press</span>
        </div>
        <div className="h-4 w-[1px] bg-border hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-xs">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            value={fileName}
            onChange={handleFileNameChange}
            className="h-8 border-none bg-transparent px-0 font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 truncate"
            title="Edit filename"
          />
        </div>
      </div>

      {/* Middle: Theme select & quick actions */}
      <div className="flex items-center gap-2">
        {/* Mobile menu trigger */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
              <Menu className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("editor")}>Editor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("preview")}>Preview</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("settings")}>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme select */}
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs font-semibold gap-1.5")}>
              Theme: <span className="text-muted-foreground capitalize">{currentTheme}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => {
                    setCurrentTheme(t.value);
                    if (t.value === "custom") {
                      setCustomCSSOpen(true);
                    }
                  }}
                  className={`text-xs ${currentTheme === t.value ? "font-bold bg-muted" : ""}`}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCustomCSSOpen(true)}
                className="text-xs text-primary font-semibold"
              >
                Configure Custom CSS...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Export / Download Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs font-semibold gap-1.5")}>
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-xs">
            <DropdownMenuItem onClick={triggerPDFExport} disabled={isExporting} className="gap-2">
              <FileCode className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadHTML} className="gap-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Download HTML</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadMarkdown} className="gap-2">
              <FileCode className="h-3.5 w-3.5" />
              <span>Download Markdown</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Upload Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Import Markdown File"
        >
          <Upload className="h-4 w-4" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".md,.txt,.markdown"
            className="hidden"
          />
        </Button>

        {/* Reset Store */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (confirm("Reset everything to default? All text and settings will be cleared.")) {
              clearMarkdown();
              resetTheme();
            }
          }}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Reset Everything"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Right: Settings Toggle & Dark Mode Toggle */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          title="Toggle App Dark Mode"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button
          variant={isSidebarOpen ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:inline-flex"
          title="Toggle Settings Panel"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
