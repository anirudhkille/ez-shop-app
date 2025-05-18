import { StyleSheet, Switch, View } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { Link } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";
import Header from "@/layout/Header";

interface LinkListProps {
  href: any;
  text: string;
}

export default function settings() {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <>
      <Header title="Settings" />
      <Container extraStyle={{ paddingTop: 10, paddingHorizontal: 0 }}>
        <LinkList href="/email" text="Email" />
        <LinkList href="/email" text="Mobile" />
        <View
          style={[
            styles.container,
            styles.list,
            { paddingVertical: 7 },
            { alignItems: "center" },
            { borderBottomColor: themeColors.border },
          ]}
        >
          <Text size={16}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDark ? themeColors.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
        <LinkList href="/" text="Log Out" />
      </Container>
    </>
  );
}

function LinkList({ href, text }: LinkListProps) {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];
  return (
    <Link
      href={href}
      style={[
        styles.list,
        {
          borderBottomColor: themeColors.border,
          color: themeColors.primary,
        },
      ]}
    >
      {text}
    </Link>
  );
}

const styles = StyleSheet.create({
  list: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    height:55
  },
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});
