"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store/theme";
import { useUIStore } from "@/lib/store/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CustomCSSDialog() {
  const { customCSS, setCustomCSS } = useThemeStore();
  const { isCustomCSSOpen, setCustomCSSOpen } = useUIStore();
  const [localCSS, setLocalCSS] = useState(customCSS);

  useEffect(() => {
    if (isCustomCSSOpen) {
      setLocalCSS(customCSS);
    }
  }, [isCustomCSSOpen, customCSS]);

  const handleSave = () => {
    setCustomCSS(localCSS);
    setCustomCSSOpen(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your custom CSS to the default template?")) {
      const defaultCSS = `/* Custom Stylesheet
   Write custom CSS styles here to override theme variables.
   All styles apply instantly to both live preview and PDF.
*/

.markdown-body {
  /* Customize font family */
  /* font-family: 'Courier New', Courier, monospace; */
}
`;
      setLocalCSS(defaultCSS);
    }
  };

  return (
    <Dialog open={isCustomCSSOpen} onOpenChange={setCustomCSSOpen}>
      <DialogContent className="max-w-2xl w-[90vw] h-[80vh] flex flex-col p-6 bg-background border border-border rounded-lg shadow-xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-md font-semibold text-foreground">Edit Custom CSS</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Custom styles will apply instantly to the editor live preview and the exported PDF.
          </DialogDescription>
        </DialogHeader>

        {/* CSS Text Editor Area */}
        <div className="flex-1 min-h-0 py-4">
          <Textarea
            value={localCSS}
            onChange={(e) => setLocalCSS(e.target.value)}
            className="w-full h-full min-h-[300px] font-mono text-xs p-4 leading-relaxed resize-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 bg-muted/20 border-border text-foreground"
            placeholder="/* Write custom CSS overrides here */"
          />
        </div>

        <DialogFooter className="flex-shrink-0 flex items-center justify-between gap-2 sm:justify-between">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            Reset to Default
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCustomCSSOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} className="text-xs">
              Apply Styles
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
