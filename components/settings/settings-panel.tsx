"use client";

import React, { useEffect, useState } from "react";
import { useSettingsStore, PageSize, Orientation, MarginType } from "@/lib/store/settings";
import { useUIStore } from "@/lib/store/ui";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function SettingsPanel() {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const store = useSettingsStore();

  // Local state to hold settings before applying
  const [pageSize, setPageSize] = useState<PageSize>(store.pageSize);
  const [orientation, setOrientation] = useState<Orientation>(store.orientation);
  const [marginType, setMarginType] = useState<MarginType>(store.marginType);
  const [displayHeaderFooter, setDisplayHeaderFooter] = useState<boolean>(store.displayHeaderFooter);
  const [printBackground, setPrintBackground] = useState<boolean>(store.printBackground);

  // Re-sync local states when the modal is opened
  useEffect(() => {
    if (isSidebarOpen) {
      setPageSize(store.pageSize);
      setOrientation(store.orientation);
      setMarginType(store.marginType);
      setDisplayHeaderFooter(store.displayHeaderFooter);
      setPrintBackground(store.printBackground);
    }
  }, [isSidebarOpen, store]);

  const handleApply = () => {
    // Commit local state changes to global store
    store.setPageSize(pageSize);
    store.setOrientation(orientation);
    store.setMarginType(marginType);
    store.setDisplayHeaderFooter(displayHeaderFooter);
    store.setPrintBackground(printBackground);

    // Close the settings dialog modal
    setSidebarOpen(false);
  };

  const pageSizes: PageSize[] = ["A4", "Letter", "Legal", "A3", "A5"];
  const marginTypes: { value: MarginType; label: string }[] = [
    { value: "normal", label: "Normal (20mm)" },
    { value: "minimum", label: "Minimum (10mm)" },
    { value: "none", label: "None (0mm)" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <Dialog open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <DialogContent className="max-w-md w-[90vw] p-6 bg-background border border-border rounded-lg shadow-xl select-none">
        <DialogHeader>
          <DialogTitle className="text-md font-semibold text-foreground">Page Export Settings</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure layout and print sizing variables for PDF documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Page Size */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Page Size</Label>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between text-xs h-9")}>
                <span>{pageSize}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[380px] max-w-[80vw] text-xs">
                {pageSizes.map((size) => (
                  <DropdownMenuItem key={size} onClick={() => setPageSize(size)}>
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Orientation */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Orientation</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orientation === "portrait" ? "default" : "outline"}
                onClick={() => setOrientation("portrait")}
                className="text-xs h-8"
              >
                Portrait
              </Button>
              <Button
                variant={orientation === "landscape" ? "default" : "outline"}
                onClick={() => setOrientation("landscape")}
                className="text-xs h-8"
              >
                Landscape
              </Button>
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Margins</Label>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between text-xs h-9")}>
                <span className="capitalize">{marginType}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[380px] max-w-[80vw] text-xs">
                {marginTypes.map((margin) => (
                  <DropdownMenuItem key={margin.value} onClick={() => setMarginType(margin.value)}>
                    {margin.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Print Toggles */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">Headers & Footers</Label>
                <p className="text-[10px] text-muted-foreground">Print page title, date and numbers</p>
              </div>
              <Switch checked={displayHeaderFooter} onCheckedChange={setDisplayHeaderFooter} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">Print Backgrounds</Label>
                <p className="text-[10px] text-muted-foreground">Keep theme background colors</p>
              </div>
              <Switch checked={printBackground} onCheckedChange={setPrintBackground} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-xs">
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleApply} className="text-xs">
            Apply Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
