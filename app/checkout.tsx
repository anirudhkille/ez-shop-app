import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCartQuery } from "@/hooks/useCart";
import { useAddressesQuery } from "@/hooks/useAddress";
import { usePlaceCODOrderMutation } from "@/hooks/useOrders";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayment";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";

export default function CheckoutScreen() {
  const router = useRouter();
  const { data: cart } = useCartQuery();
  const { data: addressesRes } = useAddressesQuery();
  const addresses =
    (addressesRes as any)?.data || (Array.isArray(addressesRes) ? addressesRes : []);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses?.[0]?._id || "");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

  const codMutation = usePlaceCODOrderMutation();
  const stripeMutation = useCreateCheckoutSessionMutation();

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }
    if (paymentMethod === "cod") {
      codMutation.mutate(
        { addressId: selectedAddressId, deliveryMethod: "Standard" },
        {
          onSuccess: (res: any) => {
            router.replace(`/order-success?orderId=${res?.order?._id || res?._id || ""}`);
          },
          onError: (err: any) =>
            Alert.alert("Order Failed", err?.message || "Could not place order"),
        }
      );
    } else {
      stripeMutation.mutate(
        { addressId: selectedAddressId, deliveryMethod: "Standard" },
        {
          onSuccess: (res: any) => {
            if (res?.url) {
              router.push(`/payment-webview?url=${encodeURIComponent(res.url)}`);
            } else {
              router.replace(`/order-success`);
            }
          },
          onError: (err: any) =>
            Alert.alert("Payment Failed", err?.message || "Could not initiate payment"),
        }
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeftIcon color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {addresses?.map((addr: any) => (
          <TouchableOpacity
            key={addr._id}
            style={[styles.addressCard, selectedAddressId === addr._id && styles.selectedCard]}
            onPress={() => setSelectedAddressId(addr._id)}
          >
            <Text style={styles.addressText}>
              {addr.street}, {addr.city}, {addr.state}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentCard, paymentMethod === "cod" && styles.selectedCard]}
          onPress={() => setPaymentMethod("cod")}
        >
          <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentCard, paymentMethod === "stripe" && styles.selectedCard]}
          onPress={() => setPaymentMethod("stripe")}
        >
          <Text style={styles.paymentText}>Online Payment (Stripe)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 50, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#F5F5F5", fontSize: 20, fontWeight: "bold" },
  section: { marginBottom: 24 },
  sectionTitle: { color: "#F5F5F5", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  addressCard: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#262626",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  paymentCard: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#262626",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedCard: { borderColor: "#FF5500" },
  addressText: { color: "#F5F5F5", fontSize: 14 },
  paymentText: { color: "#F5F5F5", fontSize: 15, fontWeight: "500" },
  orderButton: {
    backgroundColor: "#FF5500",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  orderButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
