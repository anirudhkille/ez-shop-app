import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { colors, radius } from "@/constant/color";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useUser";

export default function EditProfile() {
  const { data: profileRes } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const user = profileRes?.data;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
  }, [user]);

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
              {user?.email ?? "—"}
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
