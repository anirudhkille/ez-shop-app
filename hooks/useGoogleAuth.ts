import { useCallback, useState } from "react";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Toast from "react-native-toast-message";

import { postGoogleMobile } from "@/api/user";
import { useAuthStore } from "@/store/auth";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

let configured = false;

const configure = () => {
  if (configured || !webClientId) return;
  GoogleSignin.configure({ webClientId });
  configured = true;
};

type SignInResult =
  | { type: "success"; data: { idToken?: string | null } }
  | { type: "cancelled" }
  | { idToken?: string | null };

export const useGoogleLogin = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const [isPending, setPending] = useState(false);

  const startGoogleLogin = useCallback(async () => {
    if (!webClientId) {
      Toast.show({ type: "error", text1: "Google sign-in is not configured" });
      return;
    }

    configure();
    setPending(true);

    try {
      await GoogleSignin.hasPlayServices();
      const result = (await GoogleSignin.signIn()) as SignInResult;
      const idToken =
        "type" in result
          ? result.type === "success"
            ? result.data.idToken
            : null
          : result.idToken;

      if (!idToken) {
        Toast.show({ type: "error", text1: "Google sign-in did not return a token" });
        return;
      }

      const res = await postGoogleMobile(idToken);
      const session = res.data;

      if (!session) {
        Toast.show({ type: "error", text1: "Google sign-in failed" });
        return;
      }

      setSession({
        token: session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
      });
      Toast.show({ type: "success", text1: "Signed in with Google" });
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return;

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Toast.show({
            type: "error",
            text1: "Google Play Services is unavailable on this device",
          });
          return;
        }
      }

      Toast.show({ type: "error", text1: "Google sign-in failed" });
    } finally {
      setPending(false);
    }
  }, [setSession]);

  return { startGoogleLogin, isPending };
};
