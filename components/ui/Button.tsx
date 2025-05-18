import React from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: "primary" | "outline";
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
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];
  const styles = getButtonStyles(variant, disabled, themeColors);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.button, { opacity: loading || disabled ? 0.6 : 1 }]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

function getButtonStyles(
  variant: "primary" | "outline",
  disabled: boolean,
  themeColors: { background: string; text: string; accent: string }
) {
  const baseButton: ViewStyle = {
    height: 60,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
  };

  const baseText: TextStyle = {
    fontWeight: "600",
    fontSize: 16,
  };

  const variants = {
    primary: {
      button: {
        backgroundColor: disabled ? "#b3d4fc" : themeColors.text,
      },
      text: {
        color: disabled ? "#d1d1d1" : themeColors.background,
      },
    },
    outline: {
      button: {
        borderColor: themeColors.text,
        borderWidth: 1,
      },
      text: {
        color: disabled ? "#d1d1d1" : themeColors.text,
      },
    },
    danger: {
      button: {
        backgroundColor: disabled ? "#f8d7da" : "#dc3545",
      },
      text: {
        color: disabled ? "#d1d1d1" : "#ffffff",
      },
    },
  };

  return StyleSheet.create({
    button: { ...baseButton, ...variants[variant].button },
    text: { ...baseText, ...variants[variant].text },
    pressed: {
      opacity: 0.7,
    },
  });
}
