import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "@/types/api";

interface AuthStore {
  token: string;
  user: IUser | null;
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: "",
      user: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: IUser) => set({ user }),
      clearAuth: () => set({ token: "", user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
