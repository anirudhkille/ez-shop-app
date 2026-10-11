import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import Text from "@/components/ui/Text";
import { colors, radius } from "@/constant/color";

interface Props {
  onPress?: () => void;
}

export default function PromoBanner({ onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("@/assets/images/promo-banner.webp")}
        style={styles.image}
        contentFit="cover"
        transition={250}
      />

      <LinearGradient
        colors={["rgba(13,13,13,0.96)", "rgba(13,13,13,0.72)", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text size={11} weight="600" color="brand" style={styles.badgeText}>
            LIMITED EDITION DROP
          </Text>
        </View>

        <Text size={40} weight="700" variant="display" style={styles.title}>
          THE APEX
        </Text>
        <Text size={40} weight="700" variant="display" style={styles.titleAccent}>
          COLLECTION
        </Text>

        <Text size={14} color="muted" style={styles.body}>
          Exclusive colorways. Performance-engineered. Only 500 pairs available worldwide.
        </Text>

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          style={styles.cta}
        >
          <Text size={13} weight="700" color="brand" style={styles.ctaText}>
            SHOP THE DROP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 300,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    gap: 6,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,85,0,0.3)",
    backgroundColor: "rgba(255,85,0,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  badgeText: {
    letterSpacing: 1.2,
  },
  title: {
    color: colors.foreground,
    lineHeight: 38,
    letterSpacing: 0.5,
  },
  titleAccent: {
    color: colors.brand,
    lineHeight: 38,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  body: {
    maxWidth: 260,
    lineHeight: 20,
    marginBottom: 14,
  },
  cta: {
    alignSelf: "flex-start",
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  ctaText: {
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
