import { SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ChevronLeftIcon color={themeColors.primary} size={30} />
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaView>
  );
}
