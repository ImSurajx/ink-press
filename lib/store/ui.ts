import { create } from "zustand";

export type MobileTab = "editor" | "preview" | "settings";

interface UIState {
  activeTab: MobileTab;
  isSidebarOpen: boolean;
  isExporting: boolean;
  isCustomCSSOpen: boolean;
  panelSizes: number[];
  setActiveTab: (tab: MobileTab) => void;
  setSidebarOpen: (open: boolean) => void;
  setExporting: (exporting: boolean) => void;
  setCustomCSSOpen: (open: boolean) => void;
  setPanelSizes: (sizes: number[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "editor",
  isSidebarOpen: true,
  isExporting: false,
  isCustomCSSOpen: false,
  panelSizes: [50, 50],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setExporting: (exporting) => set({ isExporting: exporting }),
  setCustomCSSOpen: (open) => set({ isCustomCSSOpen: open }),
  setPanelSizes: (sizes) => set({ panelSizes: sizes }),
}));
