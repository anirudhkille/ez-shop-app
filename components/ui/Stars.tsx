import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";

interface StarsProps {
  rating?: number;
  size?: number;
  /** Hides the numeric value and shows only the glyphs. */
  compact?: boolean;
  reviews?: number;
}

/**
 * One rating treatment for the whole app. Home was drawing a separate set of
 * outline glyphs in muted grey while the grid drew filled stars in amber, so
 * the same rating looked like a different component per screen.
 */
export default function Stars({ rating = 0, size = 12, compact = false, reviews }: StarsProps) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <View style={styles.row}>
      <View style={styles.glyphs}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Text
            key={index}
            size={size as 12}
            style={{
              color: index < rounded ? colors.warning : colors.subtle,
              lineHeight: size + 3,
              flexShrink: 0,
            }}
          >
            {"\u2605"}
          </Text>
        ))}
      </View>

      {!compact ? (
        <Text size={12} color="muted" style={styles.value}>
          {reviews !== undefined ? `(${reviews})` : rating.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  glyphs: {
    flexDirection: "row",
    gap: 1,
  },
  value: {
    flexShrink: 0,
  },
});
