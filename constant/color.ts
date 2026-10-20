export const colors = {
  background: "#0D0D0D",
  surface: "#141414",
  surfaceRaised: "#1A1A1A",

  border: "#262626",
  borderStrong: "#383838",

  foreground: "#F4F4F4",
  muted: "#8C8C8C",
  subtle: "#575757",

  brand: "#FF5500",

  destructive: "#E5484D",
  success: "#30A46C",
  warning: "#F5A524",
} as const;

export const tagBadge: Record<string, { bg: string; fg: string }> = {
  New: { bg: colors.brand, fg: "#FFFFFF" },
  Hot: { bg: "#EF4444", fg: "#FFFFFF" },
  Sale: { bg: "#22C55E", fg: "#0D0D0D" },
  Limited: { bg: "#F5A524", fg: "#0D0D0D" },
  "Best Seller": { bg: colors.brand, fg: "#FFFFFF" },
};

export const fonts = {
  display: "BarlowCondensed_700Bold",
  displaySemiBold: "BarlowCondensed_600SemiBold",
  /**
   * One registered family per weight, because React Native on Android cannot
   * synthesise a custom family at an arbitrary `fontWeight` — asking for
   * weight 700 on "Outfit" quietly fell back to Roboto, which is why headings
   * and labels looked like a different app on device.
   */
  body: "Outfit_400Regular",
  bodyMedium: "Outfit_500Medium",
  bodySemiBold: "Outfit_600SemiBold",
  bodyBold: "Outfit_700Bold",
} as const;

export const radius = {
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;