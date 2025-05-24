import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";

interface ContainerProps {
  children: ReactNode;
  extraStyle?: ViewStyle;
}

export default function Container({ children, extraStyle }: ContainerProps) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
        extraStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
