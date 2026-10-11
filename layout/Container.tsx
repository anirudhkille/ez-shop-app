import { StyleSheet, View, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constant/color";

interface ContainerProps {
  children: ReactNode;
  extraStyle?: ViewStyle;
  /**
   * Adds the bottom safe-area inset. Enable on pushed screens, which have no
   * tab bar underneath them. Leave it off inside tabs, where the bar already
   * reserves that space and the inset would double it.
   */
  bottomInset?: boolean;
}

/**
 * Screen padding is horizontal plus bottom only. The stack header owns the top
 * inset, so adding top padding here stacked a second gap under every title —
 * which is what left pages looking loosely spaced.
 */
export default function Container({
  children,
  extraStyle,
  bottomInset = false,
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: bottomInset ? 20 + insets.bottom : 20,
        },
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
    paddingHorizontal: 20,
  },
});