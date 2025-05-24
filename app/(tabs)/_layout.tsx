import { HeartIcon } from "@/assets/icons/HeartIcon";
import { HouseIcon } from "@/assets/icons/HouseIcon";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.accent,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.accent,
          paddingBottom: 20,
          height: 60,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HouseIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => <HeartIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingBagIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
