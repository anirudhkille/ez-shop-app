import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constant/color";

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
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        style={styles.input}
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
    gap: 5,
    width: "100%",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    padding: 10,
  },
});
