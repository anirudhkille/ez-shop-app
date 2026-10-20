import { useEffect, useState } from "react";

import { refreshSession } from "@/api/client";
import { useAuthStore } from "@/store/auth";

/**
 * The access token lives in memory only, so a cold start has to trade the
 * stored refresh token for a new one before the route guard runs.
 */
export const useSessionBootstrap = (hydrated: boolean) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    (async () => {
      const { token, refreshToken } = useAuthStore.getState();

      if (!token && refreshToken) {
        await refreshSession();
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  return ready;
};
