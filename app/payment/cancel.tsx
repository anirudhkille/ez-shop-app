import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { CircleXIcon } from "@/assets/icons/CircleXIcon";
import { colors } from "@/constant/color";

/** Stripe redirect target when a card scheme bounces the customer back. */
export default function PaymentCancel() {
  const router = useRouter();

  return (
    <>
      <Header title="Payment" />
      <Container bottomInset>
        <View style={styles.center}>
          <CircleXIcon color={colors.destructive} size={56} />

          <Text size={22} weight="700" variant="display" align="center" style={styles.title}>
            Payment cancelled
          </Text>

          <Text color="muted" align="center">
            Nothing was charged. Your cart is still waiting for you.
          </Text>

          <Button
            text="Back to cart"
            style={styles.action}
            onPress={() => router.replace("/(tabs)/cart")}
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
