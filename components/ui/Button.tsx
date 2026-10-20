import React from "react";
import {
  Text as RNText,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors, fonts, radius } from "@/constant/color";

export type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** `sm` is a compact inline action, `md` is the default, `lg` is a full-width CTA. */
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export default function Button({
  text,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  size = "md",
  style,
  accessibilityLabel,
}: ButtonProps) {
  const inert = loading || disabled;
  // A primary button at 40% opacity turns muddy brown on this palette, which
  // is why the disabled newsletter CTA looked broken. Swap the fill for a
  // neutral surface instead of fading a saturated orange.
  const inertPrimary = inert && variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inert}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ disabled: inert, busy: loading }}
      style={[
        styles.button,
        sizes[size],
        variantStyles[variant].button,
        inertPrimary && styles.inertPrimary,
        inert && !inertPrimary && styles.inert,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? "#fff" : colors.foreground}
        />
      ) : (
        <RNText
          numberOfLines={1}
          style={[
            styles.text,
            sizes[size].text,
            variantStyles[variant].text,
            inertPrimary && { color: colors.subtle },
          ]}
        >
          {text}
        </RNText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    flexShrink: 0,
  },
  /**
   * Labels run in the condensed display face, matching every other action in
   * the app. They previously fell through to the platform default font
   * because no family was set, so buttons looked like a different product
   * from the screens around them.
   */
  text: {
    fontFamily: fonts.display,
    letterSpacing: 1,
    textTransform: "uppercase",
    flexShrink: 0,
  },
  inert: { opacity: 0.4 },
  inertPrimary: { backgroundColor: colors.surfaceRaised },
});

const sizes = {
  sm: {
    minHeight: 38,
    paddingHorizontal: 16,
    text: { fontSize: 14, lineHeight: 18 },
  },
  md: {
    minHeight: 50,
    paddingHorizontal: 24,
    text: { fontSize: 16, lineHeight: 20 },
  },
  lg: {
    minHeight: 54,
    paddingHorizontal: 24,
    text: { fontSize: 17, lineHeight: 22 },
  },
} as const;

type VariantStyle = { button: ViewStyle; text: { color: string } };

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: {
    button: { backgroundColor: colors.brand },
    text: { color: "#FFFFFF" },
  },
  outline: {
    button: { borderColor: colors.borderStrong, borderWidth: 1, backgroundColor: colors.surface },
    text: { color: colors.foreground },
  },
  ghost: {
    button: { backgroundColor: "transparent" },
    text: { color: colors.muted },
  },
  destructive: {
    button: { backgroundColor: colors.destructive },
    text: { color: "#FFFFFF" },
  },
};
