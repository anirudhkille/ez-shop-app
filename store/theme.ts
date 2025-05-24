import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  appliedTheme: "light" | "dark";
  setTheme: (newTheme: Theme) => void;
}

const getDeviceTheme = (): "light" | "dark" => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      appliedTheme: getDeviceTheme(),

      setTheme: (newTheme: Theme) => {
        const resolvedTheme =
          newTheme === "system" ? getDeviceTheme() : newTheme;
        set({ theme: newTheme, appliedTheme: resolvedTheme });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
