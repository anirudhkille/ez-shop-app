import { View, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { colors, radius } from "@/constant/color";
import Text from "@/components/ui/Text";

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  description: string;
  /** Muted lead-in, e.g. "Don't have an account?". */
  prompt: string;
  /** Orange action, e.g. "Create account". */
  action: string;
  href: "/login" | "/signup";
}

export function OrDivider({ label = "OR" }: { label?: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text size={12} color="muted" style={styles.dividerLabel}>
        {label}
      </Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export default function AuthLayout({
  children,
  heading,
  description,
  prompt,
  action,
  href,
}: AuthLayoutProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.card}>
          <View style={styles.headingBlock}>
            <Text size={38} weight="700" variant="display" align="center" style={styles.heading}>
              {heading.toUpperCase()}
            </Text>
            <Text size={15} color="muted" align="center">
              {description}
            </Text>
          </View>

          {children}

          <View style={styles.footer}>
            <Text size={15} color="muted">
              {prompt}{" "}
              <Link href={href} style={styles.actionLink}>
                {action}
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 20,
  },
  headingBlock: {
    gap: 8,
  },
  heading: {
    letterSpacing: 1.4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    letterSpacing: 1,
  },
  footer: {
    alignItems: "center",
    paddingTop: 4,
  },
  actionLink: {
    color: colors.brand,
    fontWeight: "700",
  },
});
