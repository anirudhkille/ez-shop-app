import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";
import { BrandLogo } from "@/assets/icons/BrandLogo";

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

export function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text size={11} weight="600" color="subtle" style={styles.dividerLabel}>
        {label.toUpperCase()}
      </Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/**
 * Auth screens.
 *
 * The form used to sit in a bordered card centred in the middle of the screen,
 * which is a web dialog, not an app screen. It also nested its own
 * SafeAreaProvider under the root one, which reset the insets. Now the content
 * is full-bleed, top-aligned, scrolls when the keyboard appears, and the
 * heading reads as a page title rather than a modal caption.
 */
export default function AuthLayout({
  children,
  heading,
  description,
  prompt,
  action,
  href,
}: AuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <BrandLogo size={24} />
            <Text size={13} weight="700" variant="display" color="brand" style={styles.brand}>
              EZ Shop
            </Text>
          </View>

          <View style={styles.headingBlock}>
            <Text size={34} weight="700" variant="display" style={styles.heading}>
              {heading.toUpperCase()}
            </Text>
            <Text size={14} color="muted" style={styles.description}>
              {description}
            </Text>
          </View>

          <View style={styles.form}>{children}</View>

          <View style={styles.footer}>
            <Text size={14} color="muted">
              {prompt}{" "}
              <Link href={href} style={styles.actionLink}>
                {action}
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 34,
  },
  brand: {
    letterSpacing: 2,
    textTransform: "uppercase",
    lineHeight: 18,
  },
  headingBlock: {
    gap: 6,
    marginBottom: 26,
  },
  heading: {
    letterSpacing: 1,
    lineHeight: 38,
  },
  description: {
    lineHeight: 20,
  },
  form: {
    gap: 18,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 28,
    alignItems: "center",
  },
  actionLink: {
    color: colors.brand,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    letterSpacing: 1.4,
    lineHeight: 15,
  },
});
