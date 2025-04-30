import Button from "@/components/ui/Button";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "column", gap: 10, marginBottom: 60 }}>
            <Text style={[styles.heading, { color: themeColors.primary }]}>
              Welcome to EZ SHOP.
            </Text>
            <Text style={{ color: themeColors.accent }}>
              Discover the ultimate shopping experience with EZ SHOP. Browse a
              wide range of products, enjoy exclusive deals, and shop with ease
              from the comfort of your home.
            </Text>
          </View>
          <Button text="Continue" onPress={() => router.push("/login")} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "600",
  },
});
