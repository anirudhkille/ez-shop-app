import { HeartIcon } from "@/assets/icons/HeartIcon";
import { HouseIcon } from "@/assets/icons/HouseIcon";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { colors } from "@/constant/color";
import { Tabs } from "expo-router";

export default function TabLayout() {
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
          paddingBottom: 20,
          height: 60,
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
