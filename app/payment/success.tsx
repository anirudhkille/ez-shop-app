import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import Container from "@/layout/container";
import Header from "@/layout/header";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import { CircleCheckIcon } from "@/assets/icons/circle-check-icon";
import { CircleXIcon } from "@/assets/icons/circle-x-icon";
import { colors } from "@/constant/color";
import { useOrderByIdQuery } from "@/hooks/useOrders";

/**
 * Shown after PaymentSheet succeeds. The client is never trusted to confirm a
 * payment, so this only waits for the backend to report what the webhook wrote.
 */
export default function PaymentSuccess() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const { data, refetch, isFetching } = useOrderByIdQuery(orderId ?? "");
  const order = data?.data;
  const reference = orderId ? `#${orderId.slice(-8).toUpperCase()}` : "";

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  const failed = order?.paymentStatus === "failed";
  const paid = order?.paymentStatus === "paid";

  // Automatic polling gives up after about two minutes; from then on the
  // customer can ask for a fresh status by hand.
  const [allowManualRefresh, setAllowManualRefresh] = useState(false);

  useEffect(() => {
    if (!orderId || paid || failed) return;

    const timer = setTimeout(() => setAllowManualRefresh(true), 120_000);

    return () => clearTimeout(timer);
  }, [orderId, paid, failed]);

  return (
    <>
      <Header title="Payment" />
      <Container bottomInset>
        <View style={styles.center}>
          {paid ? (
            <CircleCheckIcon color={colors.brand} size={56} />
          ) : failed ? (
            <CircleXIcon color={colors.destructive} size={56} />
          ) : (
            <ActivityIndicator color={colors.brand} />
          )}

          <Text size={22} weight="700" variant="display" align="center" style={styles.title}>
            {paid ? "Payment received" : failed ? "Payment failed" : "Confirming payment"}
          </Text>

          <Text color="muted" align="center">
            {paid
              ? `Order ${reference} is confirmed. A receipt is on its way to your inbox.`
              : failed
                ? "Nothing was charged. You can try again from your cart."
                : "This usually takes a few seconds. The status updates on its own."}
          </Text>

          {allowManualRefresh ? (
            <Button
              text="Refresh status"
              variant="outline"
              style={styles.action}
              loading={isFetching}
              onPress={() => void refetch()}
            />
          ) : null}

          {orderId ? (
            <Button
              text="View order"
              style={styles.action}
              onPress={() => router.replace(`/profile/order-detail/${orderId}`)}
            />
          ) : null}

          <Button
            text={failed ? "Back to cart" : "Keep shopping"}
            variant="ghost"
            onPress={() =>
              failed ? router.replace("/(tabs)/cart") : router.replace("/(tabs)/shop")
            }
          />
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 12,
  },
  title: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  action: {
    alignSelf: "stretch",
    marginTop: 10,
  },
});
