import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import Container from "@/layout/container";
import Header from "@/layout/header";
import Input from "@/components/ui/input";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import { MailIcon } from "@/assets/icons/mail-icon";
import { CircleCheckIcon } from "@/assets/icons/circle-check-icon";
import { colors, radius } from "@/constant/color";
import { useSubscribeNewsletterMutation } from "@/hooks/useNewsletter";
import { useAuthStore } from "@/store/auth";

const PERKS = [
  "New arrivals and restocks, before anyone else",
  "Occasional subscriber-only offers",
  "Twice a month at most — unsubscribe any time",
];

export default function Newsletter() {
  const user = useAuthStore((s) => s.user);
  const { mutate: subscribe, isPending } = useSubscribeNewsletterMutation();

  const [email, setEmail] = useState(user?.email ?? "");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    const value = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      Toast.show({ type: "error", text1: "Enter a valid email address" });
      return;
    }

    subscribe(value, {
      onSuccess: () => {
        setSubscribed(true);
        Toast.show({ type: "success", text1: "You're on the list" });
      },
      onError: (err: any) =>
        Toast.show({ type: "error", text1: err?.message || "Could not subscribe" }),
    });
  };

  return (
    <>
      <Header title="Newsletter" />

      <Container bottomInset extraStyle={styles.noPad}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View style={styles.iconWrap}>
              <MailIcon color={colors.brand} size={22} />
            </View>

            <Text size={11} weight="700" color="brand" style={styles.eyebrow}>
              Newsletter
            </Text>

            <Text size={30} weight="700" variant="display" style={styles.title}>
              STYLE DROPS, STRAIGHT TO YOUR INBOX
            </Text>

            <Text size={14} color="muted" style={styles.body}>
              A short note from the shop when something good lands. No noise, no daily blasts.
            </Text>
          </View>

          <View style={styles.perks}>
            {PERKS.map((perk) => (
              <View key={perk} style={styles.perk}>
                <CircleCheckIcon color={colors.brand} size={16} />
                <Text size={13} color="muted" style={styles.perkText}>
                  {perk}
                </Text>
              </View>
            ))}
          </View>

          {subscribed ? (
            <View style={styles.done}>
              <CircleCheckIcon color={colors.success} size={26} />
              <Text size={17} weight="600">
                You&apos;re on the list
              </Text>
              <Text size={13} color="muted" align="center">
                The next drop lands at {email.trim()}.
              </Text>
              <Button
                text="Use another email"
                variant="outline"
                size="sm"
                onPress={() => {
                  setSubscribed(false);
                  setEmail("");
                }}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="send"
                onSubmitEditing={handleSubscribe}
              />

              <Button text="Subscribe" size="lg" onPress={handleSubscribe} loading={isPending} />
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 22,
  },
  hero: {
    gap: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,100,10,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,100,10,0.3)",
    marginBottom: 6,
  },
  eyebrow: {
    letterSpacing: 1.4,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  title: {
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  body: {
    lineHeight: 20,
  },
  perks: {
    gap: 10,
  },
  perk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkText: {
    flex: 1,
    lineHeight: 18,
  },
  form: {
    gap: 14,
  },
  done: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
