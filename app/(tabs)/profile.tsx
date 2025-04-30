import { Text, StyleSheet } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Button from "@/components/ui/Button";

export default function settings() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <Container extraStyle={{ paddingTop: 40, gap: 40 }}>
      <Text style={[styles.name, { color: themeColors.primary }]}>
        Anirudh Kille
      </Text>
      <Button
        text="Edit profile"
        variant="outline"
        onPress={() => router.push("/")}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
  },
});
