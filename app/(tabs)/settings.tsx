import { StyleSheet, Switch, View } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { Link } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";
import Header from "@/layout/Header";

export default function settings() {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <>
      <Header title="Settings" />
      <Container extraStyle={{ paddingTop: 20, paddingHorizontal: 0 }}>
        <Link
          href="/email"
          style={[
            styles.list,
            {
              borderBottomColor: themeColors.border,
              color: themeColors.primary,
            },
          ]}
        >
          Email
        </Link>
        <Link
          href="/email"
          style={[
            styles.list,
            {
              borderBottomColor: themeColors.border,
              color: themeColors.primary,
            },
          ]}
        >
          Mobile Number
        </Link>
        <View
          style={[
            styles.container,
            styles.list,
            { borderBottomColor: themeColors.border },
          ]}
        >
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
}

const styles = StyleSheet.create({
  list: {
    borderBottomWidth: 1,
    fontSize: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});
