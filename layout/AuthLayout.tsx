import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";

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
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container,{backgroundColor:themeColors.background}]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.card}>
          <View style={{ flexDirection: "column", gap: 10 }}>
            <Text style={[styles.heading,{color:themeColors.text}]}>{heading}</Text>
            <Text style={[styles.description,{color:themeColors.accent}]}>{description}</Text>
          </View>
          <View style={styles.children}>
            {children}
            <View>
              <Link href={href} style={[styles.link,{color:themeColors.primary}]}>
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
    width: "100%",
    marginHorizontal: "auto",
  },
  card: {
    maxWidth:400,
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
  },
  children: {
    flexDirection: "column",
    gap: 20,
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});
