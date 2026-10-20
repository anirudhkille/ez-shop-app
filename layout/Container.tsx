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
  /**
   * Reserves the top safe area. Needed on tab screens: they run with
   * `headerShown: false`, so without this the content starts underneath the
   * status bar. Pushed screens leave it off because the stack header already
   * owns that inset — adding it there stacked a second gap under the title.
   */
  topInset?: boolean;
}

export default function Container({
  children,
  extraStyle,
  bottomInset = false,
  topInset = false,
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topInset ? insets.top + 8 : 0,
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