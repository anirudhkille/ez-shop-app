import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constant/color";
import Text from "@/components/ui/text";
import { BrandLogo } from "@/assets/icons/brand-logo";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Trailing control, e.g. an icon button. */
  right?: ReactNode;
  /** Brand eyebrow above the title. */
  eyebrow?: string;
  /** Shows the EZ Shop mark beside the title, matching the web storefront. */
  logo?: boolean;
}

/**
 * In-content heading for the five tab screens. The tab navigator runs with
 * `headerShown: false`, so nothing was reserving the top safe area: on a
 * device the first row of content sat under the status bar, and every screen
 * started flush against the bezel.
 */
export default function ScreenHeader({
  title,
  subtitle,
  right,
  eyebrow,
  logo = false,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {eyebrow ? (
          <Text size={11} weight="700" color="brand" style={styles.eyebrow}>
            {eyebrow}
          </Text>
        ) : null}

        <View style={styles.titleRow}>
          {logo ? <BrandLogo size={26} /> : null}

          <Text size={26} weight="700" variant="display" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {subtitle ? (
          <Text size={13} color="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 14,
  },
  left: {
    flexShrink: 1,
    gap: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  eyebrow: {
    letterSpacing: 1.4,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  title: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 30,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
});

export const headerIconButton = {
  width: 42,
  height: 42,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
