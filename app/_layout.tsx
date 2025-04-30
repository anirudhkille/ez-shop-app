import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";
import { useThemeStore } from "@/store/theme";
import { toastConfig } from "@/lib/toastConfig";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const theme = useThemeStore((state) => state.theme);

  const isDark = theme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        backgroundColor={isDark ? "black" : "white"}
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="/settings"
          options={{ title: "Settings", headerShown: true }}
        />
      </Stack>
      <Toast position="top" topOffset={20} config={toastConfig} />
    </QueryClientProvider>
  );
}
