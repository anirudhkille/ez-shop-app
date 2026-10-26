import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { colors } from "@/constant/color";
import Text from "@/components/ui/text";

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * Filter chip.
 *
 * The height is explicit on purpose. Inside a horizontal list the label was a
 * flex item in a column container with no spare height, so react-native
 * resolved it to zero - the chips rendered as empty pills (on web the text
 * measured 0px tall; native can collapse the same way). A fixed-height chip
 * with a centred label removes the failure mode entirely.
 */
export default function Chip({ label, active = false, onPress, style }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle, style]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Text
        size={13}
        weight="600"
        numberOfLines={1}
        style={{
          color: active ? "#FFFFFF" : colors.muted,
          lineHeight: 17,
          flexShrink: 0,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
});
