import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useResetPasswordMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate, isPending } = useResetPasswordMutation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (!otp || otp.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid OTP",
      });
      return;
    }
    if (!newPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a new password",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
      return;
    }
    mutate(
      { email, otp, newPassword },
      {
        onSuccess: (data) => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: data?.message || "Password reset successfully",
          });
          router.push("/login");
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error?.message || "Something went wrong",
          });
        },
      }
    );
  };

  return (
    <AuthLayout
      heading="Reset Password"
      description={`Enter the OTP sent to ${email}`}
      href="/login"
      prompt="Already reset it?"
      action="Back to login"
    >
      <Input label="OTP" value={otp} onChangeText={setOtp} placeholder="Enter 6-digit OTP" />
      <Input
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Enter new password"
      />
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm new password"
      />
      <Button text="Reset Password" onPress={handleReset} loading={isPending} />
    </AuthLayout>
  );
}
