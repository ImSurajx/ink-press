import { create } from "zustand";

export type ThemeType =
  | "github"
  | "minimal"
  | "academic"
  | "modern"
  | "dark"
  | "code-notes"
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "academic-paper"
  | "notebook"
  | "elegant-book"
  | "hacker"
  | "presentation"
  | "custom";

interface ThemeState {
  currentTheme: ThemeType;
  customCSS: string;
  setCurrentTheme: (theme: ThemeType) => void;
  setCustomCSS: (css: string) => void;
  resetTheme: () => void;
}

const defaultCustomCSS = `/* Custom Stylesheet
   Write custom CSS styles here to override theme variables.
   All styles apply instantly to both live preview and PDF.
*/

.markdown-body {
  /* Customize font family */
  /* font-family: 'Courier New', Courier, monospace; */
}
`;

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: "github",
  customCSS: defaultCustomCSS,
  setCurrentTheme: (currentTheme) => set({ currentTheme }),
  setCustomCSS: (customCSS) => set({ customCSS }),
  resetTheme: () => set({ currentTheme: "github", customCSS: defaultCustomCSS }),
}));
