import { Text as RNText, StyleSheet, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { colors, fonts } from "@/constant/color";

export type TextTone =
  "foreground" | "muted" | "subtle" | "brand" | "destructive" | "success" | "warning";

interface TextProps {
  children: ReactNode;
  /** Point size. Deliberately a plain number: the old fixed union meant every
   *  new scale step (10, 17, 26, 32) needed a type edit before it could be used. */
  size?: number;
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

/**
 * One registered family per weight.
 *
 * React Native on Android cannot synthesise a weight for a font that was
 * loaded from an asset file: pairing a custom `fontFamily` with `fontWeight`
 * made Android silently fall back to the system face. The family therefore
 * carries the weight, and no `fontWeight` is ever set.
 */
const familyNames = {
  display: fonts.display,
  displaySemi: fonts.displaySemiBold,
  body: fonts.body,
  bodyMedium: fonts.bodyMedium,
  bodySemiBold: fonts.bodySemiBold,
  bodyBold: fonts.bodyBold,
} as const;

const familyStyles = StyleSheet.create({
  display: { fontFamily: familyNames.display },
  displaySemi: { fontFamily: familyNames.displaySemi },
  body: { fontFamily: familyNames.body },
  bodyMedium: { fontFamily: familyNames.bodyMedium },
  bodySemiBold: { fontFamily: familyNames.bodySemiBold },
  bodyBold: { fontFamily: familyNames.bodyBold },
});

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
  const key: keyof typeof familyStyles =
    variant === "display"
      ? weight === "400" || weight === "500"
        ? "displaySemi"
        : "display"
      : variant === "displaySemi"
        ? "displaySemi"
        : weight === "500"
          ? "bodyMedium"
          : weight === "600"
            ? "bodySemiBold"
            : weight === "700"
              ? "bodyBold"
              : "body";

  const familyStyle = familyStyles[key];

  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[familyStyle, { fontSize: size, textAlign: align, color: toneColor[color] }, style]}
    >
      {children}
    </RNText>
  );
}

export default Text;
