import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius } from "@/constant/color";

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  /** Fraction of the screen height the sheet occupies. */
  heightRatio?: number;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

/**
 * Bottom sheet built on RN's Modal and Animated, which covers what this app
 * needs — open, close, tap the backdrop to dismiss, drag the handle to close —
 * without pulling in a gesture/reanimated stack.
 */
export default function Sheet({
  visible,
  onClose,
  heightRatio = 0.7,
  children,
  contentStyle,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, progress, dragY]);

  const translateY = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [600, 0] }),
    dragY
  );

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const close = () => {
    Animated.timing(dragY, {
      toValue: 400,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      dragY.setValue(0);
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: `${heightRatio * 100}%`,
            paddingBottom: insets.bottom,
            transform: [{ translateY }],
          },
          contentStyle,
        ]}
      >
        <Animated.View style={styles.handleArea}>
          <Animated.View style={styles.handle} />
        </Animated.View>

        <Animated.View style={styles.body}>{children}</Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  handleArea: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  body: {
    flex: 1,
  },
});
