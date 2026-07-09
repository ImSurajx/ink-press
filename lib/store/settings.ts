import { create } from "zustand";

export type PageSize = "A4" | "Letter" | "Legal" | "A3" | "A5";
export type Orientation = "portrait" | "landscape";
export type MarginType = "normal" | "none" | "minimum" | "custom";

export interface CustomMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface SettingsState {
  pageSize: PageSize;
  orientation: Orientation;
  marginType: MarginType;
  customMargins: CustomMargins;
  scale: number;
  displayHeaderFooter: boolean;
  headerTemplate: string;
  footerTemplate: string;
  printBackground: boolean;
  pageBreakStrategy: "auto" | "avoid-inside";
  
  setPageSize: (size: PageSize) => void;
  setOrientation: (orientation: Orientation) => void;
  setMarginType: (type: MarginType) => void;
  setCustomMargins: (margins: Partial<CustomMargins>) => void;
  setScale: (scale: number) => void;
  setDisplayHeaderFooter: (display: boolean) => void;
  setHeaderTemplate: (template: string) => void;
  setFooterTemplate: (template: string) => void;
  setPrintBackground: (print: boolean) => void;
  setPageBreakStrategy: (strategy: "auto" | "avoid-inside") => void;
  resetSettings: () => void;
}

const defaultSettings = {
  pageSize: "A4" as PageSize,
  orientation: "portrait" as Orientation,
  marginType: "normal" as MarginType,
  customMargins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  scale: 1,
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size: 8px; font-family: sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 20px; color: #aaa;"><span><span class="title"></span></span><span><span class="date"></span></span></div>`,
  footerTemplate: `<div style="font-size: 8px; font-family: sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 20px; color: #aaa;"><span></span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
  printBackground: true,
  pageBreakStrategy: "avoid-inside" as const,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultSettings,
  setPageSize: (pageSize) => set({ pageSize }),
  setOrientation: (orientation) => set({ orientation }),
  setMarginType: (marginType) => set({ marginType }),
  setCustomMargins: (margins) =>
    set((state) => ({ customMargins: { ...state.customMargins, ...margins } })),
  setScale: (scale) => set({ scale }),
  setDisplayHeaderFooter: (displayHeaderFooter) => set({ displayHeaderFooter }),
  setHeaderTemplate: (headerTemplate) => set({ headerTemplate }),
  setFooterTemplate: (footerTemplate) => set({ footerTemplate }),
  setPrintBackground: (printBackground) => set({ printBackground }),
  setPageBreakStrategy: (pageBreakStrategy) => set({ pageBreakStrategy }),
  resetSettings: () => set(defaultSettings),
}));
