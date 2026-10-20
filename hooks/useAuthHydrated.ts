import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/store/auth";

/**
 * Whether the persisted auth state has been read back from storage.
 *
 * Zustand rehydrates asynchronously, so the first render always sees an empty
 * token. Screens that decide "logged in or not" must wait for this to flip,
 * otherwise the guard would bounce a signed-in user to the login screen on
 * every cold start.
 *
 * This is an external store subscription rather than `useState` + an effect on
 * purpose: a state setter inside an effect can miss hydration that completed
 * between render and subscription, leaving the app on a blank splash forever.
 */
export const useAuthHydrated = () =>
  useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  );
