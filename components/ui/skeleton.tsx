import React, { useEffect, useMemo } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius } from "@/constant/color";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  rounded?: number;
}

/** A single pulsing block. Used to build list placeholders. */
export function Skeleton({ width = "100%", height = 14, rounded = 6, style }: SkeletonProps) {
  // Animated.Value is a mutable animation node rather than render state, so it
  // is memoised for a stable identity instead of being pulled off a ref.
  const pulse = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: rounded, backgroundColor: colors.surfaceRaised, opacity },
        style,
      ]}
    />
  );
}

/**
 * Placeholder for a product grid. A bare spinner left the whole screen as one
 * dark rectangle on first paint, which reads as a broken page rather than a
 * loading one.
 */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.grid} accessibilityLabel="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.body}>
            <Skeleton width="45%" height={10} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="60%" height={18} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Placeholder for stacked rows, e.g. orders and cart lines. */
export function ListSkeleton({ count = 3, height = 92 }: { count?: number; height?: number }) {
  return (
    <View style={styles.list} accessibilityLabel="Loading">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={height} rounded={radius.lg} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: "48%",
    flexGrow: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.surfaceRaised,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  list: {
    gap: 12,
    paddingHorizontal: 16,
  },
});

export default Skeleton;
