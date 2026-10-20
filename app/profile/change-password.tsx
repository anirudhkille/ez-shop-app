import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUpdatePasswordMutation } from "@/hooks/useUser";

export default function ChangePassword() {
  const router = useRouter();
  const updatePassword = useUpdatePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "The new passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Use at least 6 characters" });
      return;
    }

    updatePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Password updated" });
          router.back();
        },
        onError: (err: any) =>
          Toast.show({ type: "error", text1: err?.message || "Could not update your password" }),
      },
    );
  };

  return (
    <>
      <Header title="Change password" />

      <Container bottomInset extraStyle={styles.noPad}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Current password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <Input
            label="New password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Input
            label="Confirm new password"
            placeholder="Repeat the new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            text="Update password"
            size="lg"
            onPress={handleSubmit}
            loading={updatePassword.isPending}
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
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
