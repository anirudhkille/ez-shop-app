import { View, TextInput, StyleSheet, TextInputProps, Platform } from "react-native";
import React from "react";
import { colors, fonts, radius } from "@/constant/color";
import { Text } from "./Text";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  icon?: React.ReactNode;
  /** Rendered on the label row's trailing edge, e.g. a "Forgot password?" link. */
  labelAction?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  labelAction,
  error,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.container}>
      {label || labelAction ? (
        <View style={styles.labelRow}>
          {label ? (
            <Text size={12} weight="600" color="muted" style={styles.label}>
              {label.toUpperCase()}
            </Text>
          ) : null}
          {labelAction}
        </View>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.destructive : focused ? colors.borderStrong : colors.border,
          },
        ]}
      >
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            // react-native-web otherwise draws the browser focus ring inside the field.
            Platform.OS === "web" && ({ outlineStyle: "none" } as object),
          ]}
          placeholderTextColor={colors.subtle}
        />
      </View>

      {error ? (
        <Text size={12} color="destructive">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    letterSpacing: 1.1,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  icon: {
    width: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: colors.foreground,
    fontFamily: fonts.body,
    fontSize: 15,
    height: "100%",
  },
});
