import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { colors } from "@/constant/color";

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  description: string;
  linkText: string;
  href: "/login" | "/signup";
}

export default function AuthLayout({
  children,
  heading,
  description,
  linkText,
  href,
}: AuthLayoutProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.card}>
          <View style={{ flexDirection: "column", gap: 10 }}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.children}>
            {children}
            <View>
              <Link href={href} style={styles.link}>
                {linkText}
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    marginHorizontal: "auto",
  },
  card: {
    width: "100%",
    flexDirection: "column",
    gap: 30,
  },
  heading: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 22,
  },
  description: {
    textAlign: "center",
    color: colors.accent,
  },
  children: {
    flexDirection: "column",
    gap: 14,
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});
