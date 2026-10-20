import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "@/types/api";

interface AuthStore {
  /** Access token: memory only, never written to disk. */
  token: string;
  refreshToken: string;
  user: IUser | null;
  setSession: (session: { token: string; refreshToken?: string; user?: IUser | null }) => void;
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  clearAuth: () => void;
}

// SecureStore has no web implementation, and the app also runs in a browser
// during development. Only the refresh token is persisted either way.
const secureStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: "",
      refreshToken: "",
      user: null,
      setSession: ({ token, refreshToken, user }) =>
        set((state) => ({
          token,
          refreshToken: refreshToken ?? state.refreshToken,
          user: user ?? state.user,
        })),
      setToken: (token: string) => set({ token }),
      setUser: (user: IUser) => set({ user }),
      clearAuth: () => set({ token: "", refreshToken: "", user: null }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ refreshToken: state.refreshToken, user: state.user }),
    }
  )
);
