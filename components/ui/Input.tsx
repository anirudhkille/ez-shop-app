import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import Text from "./Text";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  size?: "sm" | "md";
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder = "",
  size = "sm",
  secureTextEntry = false,
}: InputProps) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  const heightStyle = size === "sm" ? { height: 50 } : { height: 50 };

  return (
    <View style={styles.container}>
      {label && <Text>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          heightStyle,
          { borderColor: themeColors.border, color: themeColors.primary ,backgroundColor:themeColors.card },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.accent}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
});
