import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import Text from "@/components/ui/Text";
import Badge from "@/components/ui/Badge";
import { colors, radius } from "@/constant/color";

interface Props {
  onPress?: () => void;
}

/**
 * Home hero.
 *
 * The copy used to run out past the scrim and land on top of the product
 * photography, which is why the body text was unreadable against the shoes.
 * The scrim is now a two-axis gradient that stays opaque for the whole width
 * of the text column, and the block is shorter so it no longer dominates the
 * feed before the first shelf of products.
 */
export default function PromoBanner({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.wrap}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Limited edition drop. Shop the collection."
    >
      <Image
        source={require("@/assets/images/promo-banner.webp")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={["rgba(11,11,11,1)", "rgba(11,11,11,0.9)", "rgba(11,11,11,0)"]}
        locations={[0, 0.52, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={["transparent", "rgba(11,11,11,0.55)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Badge label="Limited edition drop" tone="brand" variant="soft" />

        <Text size={32} weight="700" variant="display" style={styles.title}>
          THE APEX COLLECTION
        </Text>

        <Text size={13} color="muted" style={styles.body}>
          500 pairs, worldwide. Performance engineering, exclusive colourways.
        </Text>

        <View style={styles.cta}>
          <Text size={14} weight="700" variant="display" style={styles.ctaText}>
            Shop the drop
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 232,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
    maxWidth: 232,
  },
  title: {
    color: colors.foreground,
    lineHeight: 31,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  body: {
    lineHeight: 18,
  },
  cta: {
    alignSelf: "flex-start",
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginTop: 4,
  },
  ctaText: {
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
