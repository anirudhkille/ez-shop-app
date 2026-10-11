import { Text as RNText, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { colors, fonts } from "@/constant/color";

export type TextTone =
  "foreground" | "muted" | "subtle" | "brand" | "destructive" | "success" | "warning";

interface TextProps {
  children: ReactNode;
  size?: 11 | 12 | 13 | 14 | 15 | 16 | 18 | 20 | 22 | 24 | 34 | 38 | 40;
  weight?: "400" | "500" | "600" | "700";
  align?: "right" | "left" | "center";
  color?: TextTone;
  /** Condensed display face for headings, geometric sans for body copy. */
  variant?: "display" | "displaySemi" | "body";
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
}

const toneColor: Record<TextTone, string> = {
  foreground: colors.foreground,
  muted: colors.muted,
  subtle: colors.subtle,
  brand: colors.brand,
  destructive: colors.destructive,
  success: colors.success,
  warning: colors.warning,
};

export function Text({
  children,
  size = 16,
  weight = "400",
  align = "left",
  color = "foreground",
  variant = "body",
  numberOfLines,
  style,
}: TextProps) {
  const family =
    variant === "display"
      ? fonts.display
      : variant === "displaySemi"
        ? fonts.displaySemiBold
        : fonts.body;

  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: family,
          fontSize: size,
          fontWeight: weight,
          textAlign: align,
          flexWrap: "wrap",
          color: toneColor[color],
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

export default Text;
