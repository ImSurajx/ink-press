"use client";

import React, { useEffect, useState } from "react";
import { useSettingsStore, PageSize } from "@/lib/store/settings";
import { useUIStore } from "@/lib/store/ui";
import { Label } from "@/components/ui/label";
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

  // Re-sync local states when the modal is opened
  useEffect(() => {
    if (isSidebarOpen) {
      setPageSize(store.pageSize);
    }
  }, [isSidebarOpen, store]);

  const handleApply = () => {
    // Commit local state changes to global store
    store.setPageSize(pageSize);

    // Close the settings dialog modal
    setSidebarOpen(false);
  };

  const pageSizes: PageSize[] = ["A4", "Letter", "Legal", "A3", "A5"];

  return (
    <Dialog open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <DialogContent className="max-w-md w-[90vw] p-6 bg-background border border-border rounded-lg shadow-xl select-none">
        <DialogHeader>
          <DialogTitle className="text-md font-semibold text-foreground">Page Export Settings</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure the page layout template for PDF downloads.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
