import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GoogleIcon } from "@/assets/icons/google-icon";
import { colors, radius } from "@/constant/color";
import Text from "@/components/ui/text";

interface Props {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

export default function GoogleButton({ onPress, loading, label = "Continue with Google" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      style={[styles.button, loading && styles.inert]}
    >
      <GoogleIcon size={18} />
      <Text size={15} weight="600">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inert: { opacity: 0.5 },
});
