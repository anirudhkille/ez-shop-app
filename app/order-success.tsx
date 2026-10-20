import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { colors } from "@/constant/color";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <Container bottomInset extraStyle={styles.container}>
      <View style={styles.iconWrap}>
        <CircleCheckIcon color={colors.brand} size={40} />
      </View>

      <Text size={30} weight="700" variant="display" align="center" style={styles.title}>
        Order placed
      </Text>

      <Text size={14} color="muted" align="center" style={styles.subtitle}>
        Thanks for shopping with EZ Shop. We have emailed your receipt and will let you know when
        it ships.
      </Text>

      {orderId ? (
        <Text size={12} color="subtle" align="center" style={styles.orderId}>
          ORDER {String(orderId).slice(-8).toUpperCase()}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button text="Track my order" size="lg" onPress={() => router.replace("/profile/my-orders")} />
        <Button
          text="Continue shopping"
          variant="outline"
          onPress={() => router.replace("/(tabs)/shop")}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: "rgba(255,85,0,0.35)",
    backgroundColor: "rgba(255,85,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    letterSpacing: 1,
    lineHeight: 34,
  },
  subtitle: {
    lineHeight: 20,
    maxWidth: 300,
  },
  orderId: {
    letterSpacing: 1.4,
    marginTop: 2,
  },
  actions: {
    alignSelf: "stretch",
    gap: 10,
    marginTop: 22,
  },
});
