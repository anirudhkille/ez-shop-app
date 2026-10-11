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
import { colors, fonts, radius } from "@/constant/color";
import { Image } from "expo-image";
import Text from "@/components/ui/Text";
import { UserIcon } from "@/assets/icons/UserIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { SettingsIcon } from "@/assets/icons/SettingsIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon";
import Button from "@/components/ui/Button";
import { useProfileQuery, useLogoutMutation } from "@/hooks/useUser";
import { useSubscribeNewsletterMutation } from "@/hooks/useNewsletter";
import Toast from "react-native-toast-message";

export default function Profile() {
  const router = useRouter();
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
        <ActivityIndicator size="large" color={colors.brand} />
      </Container>
    );
  }

  if (isError) {
    // An expired session clears the token, which the root guard turns into a
    // redirect to login, so this only appears for genuinely transient failures.
    return (
      <Container extraStyle={{ justifyContent: "center", alignItems: "center", gap: 20 }}>
        <Text align="center" color="muted">
          Could not load your profile.
        </Text>
        <Button text="Try again" variant="outline" onPress={() => refetch()} />
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
              tintColor={colors.brand}
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
                    backgroundColor: colors.brand,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text size={24} weight="600" color="muted" style={{ color: colors.background }}>
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text size={24} weight="500" align="center">
              {user?.name || "User"}
            </Text>
            <Text color="muted">{user?.email}</Text>
          </View>

          <View style={styles.lists}>
            <MenuRow
              text="Your Profile"
              icon={<UserIcon color={colors.muted} />}
              onPress={() => router.push("/profile/edit-profile")}
            />
            <MenuRow
              text="My Orders"
              icon={<PackageIcon color={colors.muted} />}
              onPress={() => router.push("/profile/my-orders")}
            />
            <MenuRow
              text="Manage Addresses"
              icon={<UserIcon color={colors.muted} />}
              onPress={() => router.push("/profile/addresses")}
            />
            <MenuRow
              text="Change Password"
              icon={<SettingsIcon color={colors.muted} />}
              onPress={() => router.push("/profile/change-password")}
            />

            <View style={styles.newsletter}>
              <View style={styles.newsletterHead}>
                <Text size={12} weight="600" color="muted" style={styles.newsletterLabel}>
                  NEWSLETTER
                </Text>
                <Text size={14} color="foreground">
                  Sale drops and restocks, sent occasionally.
                </Text>
              </View>

              <View style={styles.newsletterRow}>
                <TextInput
                  style={styles.newsletterInput}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.subtle}
                  value={newsletterEmail}
                  onChangeText={setNewsletterEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="done"
                  onSubmitEditing={handleSubscribe}
                  accessibilityLabel="Email address"
                />
                <Button
                  text="Join"
                  onPress={handleSubscribe}
                  loading={isSubscribing}
                  disabled={!newsletterEmail.trim()}
                />
              </View>
            </View>

            <MenuRow
              text="Logout"
              icon={<LogoutIcon color={colors.destructive} />}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </Container>
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
  return (
    <TouchableOpacity style={[styles.list, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={{ gap: 10, alignItems: "center", flexDirection: "row" }}>
        {icon}
        <Text color="foreground">{text}</Text>
      </View>
      <ChevronRightIcon color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: colors.brand,
    marginHorizontal: "auto",
  },
  lists: {
    marginTop: 10,
    gap: 20,
    paddingBottom: 40,
  },
  newsletter: {
    gap: 14,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  newsletterHead: {
    gap: 4,
  },
  newsletterLabel: {
    letterSpacing: 1.2,
  },
  newsletterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  newsletterInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  list: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
  },
});
