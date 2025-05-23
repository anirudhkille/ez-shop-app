import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";
import { useThemeStore } from "@/store/theme";
import { toastConfig } from "@/lib/toastConfig";
import { colors } from "@/constant/color";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const isDark = appliedTheme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          backgroundColor={isDark ? "black" : "white"}
          barStyle={isDark ? "light-content" : "dark-content"}
        />
        <Stack
          screenOptions={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerTintColor: themeColors.primary,
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast position="top" topOffset={20} config={toastConfig} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
