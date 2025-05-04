import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import Text from "./Text";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder = "",
  secureTextEntry = false,
}: InputProps) {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: themeColors.primary,
            color: themeColors.primary,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#aaa"
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
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
