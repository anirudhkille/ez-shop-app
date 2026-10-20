import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { colors, fonts } from "@/constant/color";
import Text from "@/components/ui/Text";

export type BadgeTone = "brand" | "success" | "danger" | "warning" | "info" | "neutral";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /**
   * `soft` tints the surface with the tone (status chips), `solid` fills it
   * (promotional product tags). Shape and type are identical either way - it
   * was the mismatched radii and one-off colours that made these look random.
   */
  variant?: "solid" | "soft";
  style?: ViewStyle;
}

const solid: Record<BadgeTone, string> = {
  brand: colors.brand,
  success: colors.success,
  danger: colors.destructive,
  warning: colors.warning,
  info: "#3B82F6",
  neutral: colors.borderStrong,
};

const soft: Record<BadgeTone, { bg: string; fg: string }> = {
  brand: { bg: "rgba(255,85,0,0.16)", fg: "#FF8340" },
  success: { bg: "rgba(48,164,108,0.16)", fg: "#4ADE80" },
  danger: { bg: "rgba(229,72,77,0.16)", fg: "#FF6B6B" },
  warning: { bg: "rgba(245,165,36,0.16)", fg: "#F5A524" },
  info: { bg: "rgba(59,130,246,0.16)", fg: "#60A5FA" },
  neutral: { bg: colors.surfaceRaised, fg: colors.muted },
};

/** Text colours that stay legible on the saturated fills above. */
const onSolid: Record<BadgeTone, string> = {
  brand: "#FFFFFF",
  success: "#08130D",
  danger: "#FFFFFF",
  warning: "#1A1200",
  info: "#FFFFFF",
  neutral: colors.foreground,
};

export default function Badge({ label, tone = "neutral", variant = "solid", style }: BadgeProps) {
  const isSoft = variant === "soft";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isSoft ? soft[tone].bg : solid[tone] },
        style,
      ]}
    >
      <Text
        size={10}
        weight="700"
        variant="display"
        style={{
          color: isSoft ? soft[tone].fg : onSolid[tone],
          letterSpacing: 0.9,
          lineHeight: 13,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    height: 21,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
