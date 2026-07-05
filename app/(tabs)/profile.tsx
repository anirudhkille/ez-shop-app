import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import { Image } from "expo-image";
import Text from "@/components/ui/Text";
import { UserIcon } from "@/assets/icons/UserIcon";
import { PaletteIcon } from "@/assets/icons/PaletteIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { SettingsIcon } from "@/assets/icons/SettingsIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Button from "@/components/ui/Button";
import {
  useProfileQuery,
  useLogoutMutation,
} from "@/hooks/useUser";
import { useSubscribeNewsletterMutation } from "@/hooks/useNewsletter";
import Toast from "react-native-toast-message";

export default function Profile() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const router = useRouter();
  const [sheetIndex, setSheetIndex] = useState(-1);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { data: profileRes, isLoading, isError, refetch, isRefetching } = useProfileQuery();
  const { mutate: logout } = useLogoutMutation();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribeNewsletterMutation();

  const user = profileRes?.data;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () =>
          logout(undefined, {
            onSuccess: () => router.replace("/"),
          }),
      },
    ]);
  };

  const handleSubscribe = () => {
    if (!newsletterEmail.trim()) return;
    subscribe(newsletterEmail.trim(), {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Subscribed to newsletter!" });
        setNewsletterEmail("");
      },
      onError: (err: any) => {
        Toast.show({ type: "error", text1: err?.message || "Subscription failed" });
      },
    });
  };

  if (isLoading) {
    return (
      <Container extraStyle={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container extraStyle={{ justifyContent: "center", alignItems: "center", gap: 20 }}>
        <Text align="center">Failed to load profile</Text>
        <Button text="Retry" onPress={() => refetch()} />
      </Container>
    );
  }

  return (
    <>
      <Container extraStyle={{ paddingTop: 20, gap: 20 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={themeColors.primary}
            />
          }
        >
          <View style={{ alignItems: "center", gap: 12, marginBottom: 10 }}>
            {user?.avatar ? (
              <Image source={user.avatar} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    backgroundColor: themeColors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text size={24} weight="600" color="accent" style={{ color: themeColors.background }}>
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text size={24} weight="500" align="center">
              {user?.name || "User"}
            </Text>
            <Text color="accent">{user?.email}</Text>
          </View>

          <View style={styles.lists}>
            <MenuRow
              text="Your Profile"
              icon={<UserIcon color={themeColors.primary} />}
              onPress={() => router.push("/profile/edit-profile")}
            />
            <MenuRow
              text="My Orders"
              icon={<PackageIcon color={themeColors.primary} />}
              onPress={() => router.push("/profile/my-orders")}
            />
            <MenuRow
              text="Manage Addresses"
              icon={<UserIcon color={themeColors.primary} />}
              onPress={() => router.push("/profile/addresses")}
            />
            <MenuRow
              text="Change Password"
              icon={<SettingsIcon color={themeColors.primary} />}
              onPress={() => router.push("/profile/change-password")}
            />
            <MenuRow
              text="Appearance"
              icon={<PaletteIcon color={themeColors.primary} />}
              onPress={() => setSheetIndex(0)}
            />

            <View
              style={[
                styles.list,
                {
                  backgroundColor: themeColors.card,
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 12,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <LogoutIcon color={themeColors.primary} />
                <Text color="primary">Newsletter</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: themeColors.primary,
                    backgroundColor: themeColors.background,
                  }}
                  placeholder="Enter email"
                  placeholderTextColor={themeColors.accent}
                  value={newsletterEmail}
                  onChangeText={setNewsletterEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Button
                  text="Subscribe"
                  onPress={handleSubscribe}
                  loading={isSubscribing}
                />
              </View>
            </View>

            <MenuRow
              text="Logout"
              icon={<LogoutIcon color={themeColors.primary} />}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </Container>

      <ThemeToggle
        index={sheetIndex}
        onChangeIndex={(index) => setSheetIndex(index)}
      />
    </>
  );
}

function MenuRow({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <TouchableOpacity
      style={[styles.list, { backgroundColor: themeColors.card }]}
      onPress={onPress}
    >
      <View style={{ gap: 10, alignItems: "center", flexDirection: "row" }}>
        {icon}
        <Text color="primary">{text}</Text>
      </View>
      <ChevronRightIcon color={themeColors.accent} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#0553",
    marginHorizontal: "auto",
  },
  lists: {
    marginTop: 10,
    gap: 20,
    paddingBottom: 40,
  },
  list: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
  },
});
