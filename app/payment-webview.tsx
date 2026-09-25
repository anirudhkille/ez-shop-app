import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";

export default function PaymentWebviewScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url.includes("success") || navState.url.includes("order-success")) {
      router.replace("/order-success");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeftIcon color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
      </View>
      <WebView
        source={{ uri: decodeURIComponent((url as string) || "https://stripe.com") }}
        onNavigationStateChange={handleNavigationStateChange}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#F5F5F5", fontSize: 18, fontWeight: "bold" },
});
