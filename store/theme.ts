import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

const getDeviceTheme = (): Theme => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: getDeviceTheme(),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
