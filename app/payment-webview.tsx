import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/layout/Header";
import { colors } from "@/constant/color";

export default function PaymentWebviewScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();

  const handleNavigationStateChange = (navState: { url: string }) => {
    if (navState.url.includes("success") || navState.url.includes("order-success")) {
      router.replace("/order-success");
    }
  };

  return (
    <>
      {/* The native stack header supplies the title, back control and top inset,
          so the page no longer hand-rolls a header 50px down from the bezel. */}
      <Header title="Secure payment" />

      <View style={styles.container}>
        <WebView
          source={{ uri: decodeURIComponent(url || "https://stripe.com") }}
          onNavigationStateChange={handleNavigationStateChange}
          style={styles.webview}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
