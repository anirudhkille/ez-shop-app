import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger"; // Define your variants
  disabled?: boolean;
}

export default function Button({
  text,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const styles = getButtonStyles(variant, disabled);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

function getButtonStyles(
  variant: "primary" | "secondary" | "danger",
  disabled: boolean
) {
  const baseButton: ViewStyle = {
    paddingVertical: 8,
    height:40,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  };

  const baseText: TextStyle = {
    fontWeight: "semibold",
  };

  const variants = {
    primary: {
      button: {
        backgroundColor: disabled ? "#b3d4fc" : "black",
      },
      text: {
        color: disabled ? "#d1d1d1" : "#ffffff",
      },
    },
    secondary: {
      button: {
        backgroundColor: disabled ? "#e2e3e5" : "#6c757d",
      },
      text: {
        color: disabled ? "#d1d1d1" : "#ffffff",
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
