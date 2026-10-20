import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { colors, radius } from "@/constant/color";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useUser";
import { IUser } from "@/types/api";

/**
 * The form owns the draft values, so it is only mounted once the profile has
 * loaded. Seeding fields from an effect instead would briefly render empty
 * inputs and then overwrite whatever the user had started typing.
 */
function ProfileForm({ user }: { user: IUser }) {
  const updateProfile = useUpdateProfileMutation();

  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Please enter your name" });
      return;
    }

    updateProfile.mutate(
      { name: name.trim(), phone: phone.trim() },
      {
        onSuccess: () => Toast.show({ type: "success", text1: "Profile updated" }),
        onError: (err: any) =>
          Toast.show({ type: "error", text1: err?.message || "Could not update your profile" }),
      },
    );
  };

  return (
    <>
      <Header title="Personal details" />

      <Container bottomInset extraStyle={styles.noPad}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.readOnly}>
            <Text size={11} weight="700" color="muted" style={styles.readOnlyLabel}>
              Email
            </Text>
            <Text size={14} color="muted">
              {user.email ?? "—"}
            </Text>
            <Text size={12} color="subtle">
              Your email is used to sign in and cannot be changed here.
            </Text>
          </View>

          <Input
            label="Full name"
            placeholder="Anirudh Kille"
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />
          <Input
            label="Phone"
            placeholder="98450 12345"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            text="Save changes"
            size="lg"
            onPress={handleSave}
            loading={updateProfile.isPending}
          />
        </View>
      </Container>
    </>
  );
}

export default function EditProfile() {
  const { data: profileRes, isLoading } = useProfileQuery();
  const user = profileRes?.data;

  if (!user) {
    return (
      <>
        <Header title="Personal details" />
        <Container bottomInset>
          {isLoading ? <ListSkeleton count={2} height={64} /> : null}
        </Container>
      </>
    );
  }

  return <ProfileForm key={user._id} user={user} />;
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  readOnly: {
    gap: 3,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  readOnlyLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
