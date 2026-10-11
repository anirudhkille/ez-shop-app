import { StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUpdatePasswordMutation } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function ChangePassword() {
  const router = useRouter();
  const { mutate: updatePassword, isPending } = useUpdatePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Password must be at least 6 characters" });
      return;
    }

    updatePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Password updated successfully" });
          router.back();
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.message || "Failed to update password",
          });
        },
      }
    );
  };

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <Input
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Input
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button text="Update Password" onPress={handleSubmit} loading={isPending} />
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
