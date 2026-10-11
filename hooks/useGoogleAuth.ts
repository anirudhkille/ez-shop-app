import { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

import { API_URL } from "@/api/client";
import { useAuthStore } from "@/store/auth";

const SCHEME = "ezshop";
const REDIRECT_URI = `${SCHEME}://auth/callback`;

export const useGoogleLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const [isPending, setPending] = useState(false);

  const startGoogleLogin = useCallback(async () => {
    setPending(true);

    try {
      const startUrl = `${API_URL}/user/google?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

      const result = await WebBrowser.openAuthSessionAsync(startUrl, REDIRECT_URI);

      if (result.type !== "success") {
        return;
      }

      const params = new URLSearchParams(result.url.split("?")[1] ?? "");

      if (params.get("error")) {
        Toast.show({ type: "error", text1: params.get("error") as string });
        return;
      }

      const accessToken = params.get("accessToken");

      if (!accessToken) {
        Toast.show({ type: "error", text1: "Google sign-in did not return a token" });
        return;
      }

      setToken(accessToken);
      Toast.show({ type: "success", text1: "Signed in with Google" });
    } catch {
      Toast.show({ type: "error", text1: "Google sign-in failed" });
    } finally {
      setPending(false);
    }
  }, [setToken]);

  return { startGoogleLogin, isPending };
};