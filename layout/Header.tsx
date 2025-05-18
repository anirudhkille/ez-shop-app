import { TouchableOpacity } from "react-native";
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
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <Stack.Screen
      options={{
        title: title,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 10, marginRight: 20 }}
          >
            <ChevronLeftIcon
              color={themeColors.primary}
              
            />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
