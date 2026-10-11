import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth";
import { ApiAuthError } from "@/api/client";
import { toastConfig } from "@/lib/toastConfig";
import { colors } from "@/constant/color";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Reachable without a token. Everything else requires sign-in. */
const PUBLIC_ROUTES = ["login", "signup", "forgot-password", "reset-password", "verify-otp"];

/** No point retrying a request the server refused on auth grounds. */
const retryUnlessAuthError = (failureCount: number, error: unknown) => {
  if (error instanceof ApiAuthError) return false;
  return failureCount < 2;
};

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: retryUnlessAuthError, staleTime: 60_000 },
        },
      })
  );
  const router = useRouter();
  const segments = useSegments();
  const token = useAuthStore((s) => s.token);

  const [fontsLoaded] = useFonts({
    BarlowCondensed_700Bold: require("../assets/fonts/BarlowCondensed-Bold.ttf"),
    BarlowCondensed_600SemiBold: require("../assets/fonts/BarlowCondensed-SemiBold.ttf"),
    Outfit: require("../assets/fonts/Outfit.ttf"),
  });

  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    if (!hydrated) return;

    // The index route yields no segment, so `segments[0]` is undefined there.
    // `includes(undefined)` is false, which correctly treats "/" as protected.
    const isPublic = PUBLIC_ROUTES.includes(segments[0]);

    if (!token && !isPublic) {
      router.replace("/login");
    } else if (token && isPublic) {
      router.replace("/(tabs)");
    }
  }, [hydrated, token, segments, router]);

  if (!fontsLoaded || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar backgroundColor={colors.brand} barStyle="light-content" />
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: { color: colors.foreground },
              headerTintColor: colors.foreground,
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: "fade",
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
          <Toast position="top" topOffset={20} config={toastConfig} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
