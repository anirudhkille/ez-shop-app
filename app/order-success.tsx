import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <CircleCheckIcon color="#FF5500" size={80} />
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Thank you for shopping with EZ-Shop.</Text>
      {orderId ? <Text style={styles.orderId}>Order ID: {orderId}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/home")}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { color: "#F5F5F5", fontSize: 24, fontWeight: "bold", marginTop: 20, textAlign: "center" },
  subtitle: { color: "#8C8C8C", fontSize: 16, textAlign: "center", marginTop: 8, marginBottom: 16 },
  orderId: { color: "#FF5500", fontSize: 14, marginBottom: 30 },
  button: {
    backgroundColor: "#FF5500",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
