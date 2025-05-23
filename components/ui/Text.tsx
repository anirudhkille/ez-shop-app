import { Text as RNText, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";

interface TextProps {
  children: ReactNode;
  size?: 14 | 16 | 18 | 20 | 22 | 24;
  weight?: "400" | "500" | "600";
  align?: "right" | "left" | "center";
  color?: "primary" | "accent";
  style?: TextStyle | TextStyle[];
}

export default function Text({
  children,
  size = 16,
  weight = "400",
  align = "left",
  color = "primary",
  style,
}: TextProps) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme][color];

  return (
    <RNText
      style={[
        {
          fontSize: size,
          fontWeight: weight,
          textAlign: align,
          flexWrap: "wrap",
          color: themeColors,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
