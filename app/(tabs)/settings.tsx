import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import { Link, Stack, useRouter } from "expo-router";
import { LucideArrowLeft } from "lucide-react-native";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";

const settings = () => {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <LucideArrowLeft color={themeColors.text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Container extraStyle={{ paddingTop: 20, paddingHorizontal: 0 }}>
        <Link
          href="/email"
          style={{
            borderWidth: 1,
            borderBottomColor: themeColors.border,
            color: themeColors.primary,
            fontSize: 18,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          Email
        </Link>
        <Link
          href="/email"
          style={{
            borderWidth: 1,
            borderBottomColor: themeColors.border,
            color: themeColors.primary,
            fontSize: 18,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          Mobile Number
        </Link>
        <View style={styles.container}>
          <Text size={18}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDark ? themeColors.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
      </Container>
    </>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    borderWidth: 1,
    fontSize: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
