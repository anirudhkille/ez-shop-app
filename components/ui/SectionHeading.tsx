import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon";

interface SectionHeadingProps {
  title: string;
  /** Optional trailing affordance, e.g. "See all". */
  action?: string;
  onPressAction?: () => void;
  style?: ViewStyle;
}

/**
 * Section headings were split between condensed uppercase ("FEATURED") and
 * default body type ("Categories") in the same scroll view. One component now
 * owns that decision.
 */
export default function SectionHeading({
  title,
  action,
  onPressAction,
  style,
}: SectionHeadingProps) {
  return (
    <View style={[styles.row, style]}>
      <Text size={20} weight="700" variant="display" style={styles.title}>
        {title}
      </Text>

      {action ? (
        <TouchableOpacity
          onPress={onPressAction}
          hitSlop={10}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={action}
          style={styles.action}
        >
          <Text size={13} weight="600" color="brand" style={styles.actionText}>
            {action}
          </Text>
          <ChevronRightIcon color={colors.brand} size={15} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    letterSpacing: 1.1,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
  },
  actionText: {
    flexShrink: 0,
  },
});
