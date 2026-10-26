import { HeartIcon } from "@/assets/icons/heart-icon";
import { HouseIcon } from "@/assets/icons/house-icon";
import { SearchIcon } from "@/assets/icons/search-icon";
import { ShoppingBagIcon } from "@/assets/icons/shopping-bag-icon";
import { UserIcon } from "@/assets/icons/user-icon";
import { colors, fonts } from "@/constant/color";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // Each tab supplies its own context in the page body, so the navigator
        // header would only repeat it.
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          // The bar has to own the gesture inset itself, otherwise it floats
          // above the system navigation bar and the labels get clipped.
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 10,
          letterSpacing: 0.2,
          // The label is a flex child inside the tab item. On web it was being
          // compressed to a 7px box with overflow hidden, which sliced the
          // glyphs in half, so pin the line box and stop it shrinking.
          lineHeight: 13,
          flexShrink: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HouseIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <SearchIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => <HeartIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingBagIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserIcon color={color as string} />,
        }}
      />
    </Tabs>
  );
}
