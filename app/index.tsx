import SplashScreen from "@/components/shared/SplashScreen";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
  }, []);

  if (!isAppReady) {
    return <SplashScreen onFinish={() => setIsAppReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "column", gap: 10, marginBottom: 60 }}>
            <Text size={18} weight="600">
              Welcome to EZ SHOP.
            </Text>
            <Text color="accent">
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
});
