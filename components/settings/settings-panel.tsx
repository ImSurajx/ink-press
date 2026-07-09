"use client";

import React from "react";
import { useSettingsStore, PageSize, Orientation, MarginType } from "@/lib/store/settings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPanel() {
  const {
    pageSize,
    setPageSize,
    orientation,
    setOrientation,
    marginType,
    setMarginType,
    displayHeaderFooter,
    setDisplayHeaderFooter,
    printBackground,
    setPrintBackground,
  } = useSettingsStore();

  const pageSizes: PageSize[] = ["A4", "Letter", "Legal", "A3", "A5"];
  const marginTypes: { value: MarginType; label: string }[] = [
    { value: "normal", label: "Normal (20mm)" },
    { value: "minimum", label: "Minimum (10mm)" },
    { value: "none", label: "None (0mm)" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background border-l border-border select-none">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs font-semibold text-foreground bg-muted/40">
        <span>PAGE SETTINGS</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Size */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">Page Size</Label>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between text-xs h-9")}>
              <span>{pageSize}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs">
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
            <DropdownMenuContent className="w-56 text-xs">
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
    </div>
  );
}
