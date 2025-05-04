import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { Tabs } from "expo-router";
import { Heart, Search, House, ShoppingBag, User } from "lucide-react-native";

export default function TabLayout() {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

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
          tabBarIcon: ({ color }) => (
            <House size={24} strokeWidth={1.5} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <Search size={24} strokeWidth={1.5} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <Heart size={24} strokeWidth={1.5} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <ShoppingBag size={24} strokeWidth={1.5} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={24} strokeWidth={1.5} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="email" options={{ href: null }} />
    </Tabs>
  );
}
