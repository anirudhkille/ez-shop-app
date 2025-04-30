import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { Link, Stack, useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import { LucideArrowLeft } from "lucide-react-native";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import AntDesign from "@expo/vector-icons/AntDesign";

const settings = () => {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

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
        {/* <Link
          href="/email"
          style={{
            borderWidth: 1,
            borderBottomColor: themeColors.border,
            color: themeColors.primary,
            fontSize:18,
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
            fontSize:18,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          Mobile Number
        </Link> */}
        lo
      </Container>
    </>
  );
};

export default settings;

const styles = StyleSheet.create({});
