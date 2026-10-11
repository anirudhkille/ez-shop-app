import { TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";

import { colors } from "@/constant/color";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";

interface HeaderProps {
  /**
   * Optional. Pass one only when the page does not already state its own
   * heading. The bar itself is always provided by the native stack so that the
   * top safe area is inset correctly and the back control has a real hit target.
   */
  title?: string;
}

/**
 * Every screen renders this so the native header owns the top inset.
 *
 * An explicit empty `headerTitle` is essential: when it is `undefined`,
 * React Navigation falls back to the auto-generated route name, which is why
 * "profile/edit-profile" was appearing above pages that had no title.
 */
export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: title ?? "",
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ paddingLeft: 8 }}
          >
            <ChevronLeftIcon color={colors.foreground} size={28} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: "BarlowCondensed_600SemiBold",
          fontSize: 17,
          color: colors.foreground,
        },
      }}
    />
  );
}
