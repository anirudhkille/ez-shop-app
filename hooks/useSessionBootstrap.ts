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
        // A cold start can outrun the network; retry a transport failure a
        // couple of times instead of dropping a valid session on the login
        // screen. A rejected token clears the store, so that stops the retries.
        const retryRefresh = async (attempt = 0): Promise<void> => {
          if (cancelled) return;

          const refreshed = await refreshSession();
          if (refreshed || cancelled || !useAuthStore.getState().refreshToken) return;
          if (attempt >= 2) return;

          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          await retryRefresh(attempt + 1);
        };

        await retryRefresh();
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  return ready;
};
