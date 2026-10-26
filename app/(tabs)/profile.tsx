import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { useRouter } from "expo-router";
import { colors, radius } from "@/constant/color";
import { Image } from "expo-image";
import Text from "@/components/ui/Text";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { UserIcon } from "@/assets/icons/UserIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { MailIcon } from "@/assets/icons/MailIcon";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon";
import { useProfileQuery, useLogoutMutation } from "@/hooks/useUser";

export default function Profile() {
  const router = useRouter();

  const { data: profileRes, isLoading, isError, refetch, isRefetching } = useProfileQuery();
  const { mutate: logout } = useLogoutMutation();

  const user = profileRes?.data;

  const handleLogout = () => {
    Alert.alert("Log out", "You will need to sign in again to see your orders.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => logout(undefined, { onSuccess: () => router.replace("/") }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <Container topInset extraStyle={styles.center}>
        <ActivityIndicator color={colors.brand} />
      </Container>
    );
  }

  if (isError) {
    // An expired session clears the token, which the root guard turns into a
    // redirect to login, so this only appears for genuinely transient failures.
    return (
      <Container topInset extraStyle={styles.center}>
        <Text align="center" color="muted">
          Could not load your account.
        </Text>
        <Button text="Try again" variant="outline" size="sm" onPress={() => refetch()} />
      </Container>
    );
  }

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <Container topInset extraStyle={styles.noPad}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand} />
        }
      >
        <View style={styles.pad}>
          <ScreenHeader title="Account" />
        </View>

        <TouchableOpacity
          style={[styles.identity, styles.pad]}
          activeOpacity={0.8}
          onPress={() => router.push("/profile/edit-profile")}
          accessibilityRole="button"
          accessibilityLabel="Edit your profile"
        >
          <View style={styles.avatar}>
            {user?.avatar ? (
              <Image source={user.avatar} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <Text size={24} weight="700" variant="display" color="brand">
                {initial}
              </Text>
            )}
          </View>

          <View style={styles.identityText}>
            <Text size={18} weight="600" numberOfLines={1}>
              {user?.name || "Your account"}
            </Text>
            <Text size={13} color="muted" numberOfLines={1}>
              {user?.email}
            </Text>
          </View>

          <ChevronRightIcon color={colors.subtle} size={20} />
        </TouchableOpacity>

        <View style={styles.card}>
          <MenuRow
            icon={<UserIcon color={colors.foreground} size={19} />}
            label="Personal details"
            onPress={() => router.push("/profile/edit-profile")}
          />
          <Divider />
          <MenuRow
            icon={<PackageIcon color={colors.foreground} size={19} />}
            label="My orders"
            onPress={() => router.push("/profile/my-orders")}
          />
          <Divider />
          <MenuRow
            icon={<MapPinIcon color={colors.foreground} size={19} />}
            label="Saved addresses"
            onPress={() => router.push("/profile/addresses")}
          />
          <Divider />
          <MenuRow
            icon={<LockIcon color={colors.foreground} size={19} />}
            label="Change password"
            onPress={() => router.push("/profile/change-password")}
          />
          <Divider />
          <MenuRow
            icon={<MailIcon color={colors.foreground} size={19} />}
            label="Newsletter"
            onPress={() => router.push("/newsletter")}
          />
          <Divider />
          <MenuRow
            icon={<LogoutIcon color={colors.destructive} size={19} />}
            label="Log out"
            onPress={handleLogout}
            destructive
          />
        </View>
      </ScrollView>
    </Container>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function MenuRow({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <Text
        size={15}
        weight="500"
        color={destructive ? "destructive" : "foreground"}
        style={styles.rowLabel}
        numberOfLines={1}
      >
        {label}
      </Text>
      {destructive ? null : <ChevronRightIcon color={colors.subtle} size={18} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  content: {
    paddingBottom: 32,
    gap: 18,
  },
  pad: {
    paddingHorizontal: 20,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },

  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,100,10,0.35)",
    backgroundColor: "rgba(255,100,10,0.14)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  identityText: {
    flex: 1,
    gap: 2,
  },

  /**
   * One grouped card with dividers instead of five separate cards floating in
   * a column. The old layout read as unrelated blocks rather than a settings
   * list, and spacing every row 20px apart is what made the page feel loose.
   */
  card: {
    marginHorizontal: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
});
