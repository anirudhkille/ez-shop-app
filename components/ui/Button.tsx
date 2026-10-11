import React from "react";
import {
  Text as RNText,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors, radius } from "@/constant/color";

export type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  text,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const inert = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inert}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: inert, busy: loading }}
      style={[styles.button, variantStyles[variant].button, inert && styles.inert]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? "#fff" : colors.foreground}
        />
      ) : (
        <RNText style={[styles.text, variantStyles[variant].text]}>{text}</RNText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: 28,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  inert: { opacity: 0.45 },
});

type VariantStyle = { button: ViewStyle; text: TextStyle };

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: {
    button: { backgroundColor: colors.brand },
    text: { color: "#FFFFFF" },
  },
  outline: {
    button: { borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface },
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
