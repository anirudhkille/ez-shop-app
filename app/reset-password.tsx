import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layout";
import { useResetPasswordMutation } from "@/hooks/useUser";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate, isPending } = useResetPasswordMutation();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (!otp || otp.length < 6) {
      Toast.show({ type: "error", text1: "Enter the 6-digit code from your email" });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Use at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "The passwords do not match" });
      return;
    }

    mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Password reset. Sign in to continue." });
          router.replace("/login");
        },
        onError: (error: any) =>
          Toast.show({ type: "error", text1: error?.message || "Could not reset the password" }),
      },
    );
  };

  return (
    <AuthLayout
      heading="Reset password"
      description={email ? `Enter the code sent to ${email} and pick a new password.` : "Enter your code and pick a new password."}
      href="/login"
      prompt="Changed your mind?"
      action="Back to login"
    >
      <Input
        label="Verification code"
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="one-time-code"
      />
      <Input
        label="New password"
        placeholder="At least 6 characters"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoComplete="new-password"
      />
      <Input
        label="Confirm new password"
        placeholder="Repeat the new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
      />
      <Button text="Reset password" size="lg" onPress={handleReset} loading={isPending} />
    </AuthLayout>
  );
}
