import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { Stack, useRouter } from "expo-router";
import { LucideArrowLeft } from "lucide-react-native";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";

export default function email() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Email",
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
        <Text align="center">Your current account email address is</Text>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({});
