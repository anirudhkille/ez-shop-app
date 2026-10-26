import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "@/constant/color";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * One empty/error treatment. Previously each screen dropped a bare sentence
 * into the middle of a black screen; several then added their own oversized
 * button, which is what made a category with no hits look like a crash.
 */
export default function EmptyState({
  title,
  body,
  icon,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.wrap, style]}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}

      <Text size={18} weight="700" variant="display" align="center" style={styles.title}>
        {title}
      </Text>

      {body ? (
        <Text size={14} color="muted" align="center" style={styles.body}>
          {body}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Button text={actionLabel} variant="outline" size="sm" onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 10,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 24,
  },
  body: {
    lineHeight: 20,
    maxWidth: 260,
  },
  action: {
    marginTop: 8,
  },
});
