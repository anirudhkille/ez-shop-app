import { TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";

import { colors, fonts } from "@/constant/color";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";

interface HeaderProps {
  /**
   * Optional. Pass one only when the page does not already state its own
   * heading. The bar itself is always provided by the native stack so that the
   * top safe area is inset correctly and the back control has a real hit target.
   */
  title?: string;
  /**
   * Floats the bar over the screen content instead of reserving a strip above
   * it. Used by the product hero, where a solid bar left a dead band of empty
   * background between the status bar and the image.
   */
  transparent?: boolean;
}

/**
 * Every screen renders this so the native header owns the top inset.
 *
 * An explicit empty `headerTitle` is essential: when it is `undefined`,
 * React Navigation falls back to the auto-generated route name, which is why
 * "profile/edit-profile" was appearing above pages that had no title.
 */
export default function Header({ title, transparent = false }: HeaderProps) {
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: transparent,
        headerTitle: title ?? "",
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={
              // Over a photograph the bare chevron disappeared against light
              // product shots, so the floating variant gets its own scrim.
              transparent
                ? {
                    marginLeft: 8,
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.45)",
                  }
                : { paddingLeft: 8 }
            }
          >
            <ChevronLeftIcon color={colors.foreground} size={transparent ? 24 : 28} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: transparent ? "transparent" : colors.background },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: fonts.displaySemiBold,
          fontSize: 17,
          color: colors.foreground,
        },
      }}
    />
  );
}
