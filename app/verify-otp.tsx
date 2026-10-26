import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layout";
import { useVerifySignupOTPMutation } from "@/hooks/useUser";

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate, isPending } = useVerifySignupOTPMutation();
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (!otp || otp.length < 6) {
      Toast.show({ type: "error", text1: "Enter the 6-digit code we emailed you" });
      return;
    }

    mutate(
      { email, otp },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Email verified" });
          router.replace("/home");
        },
        onError: (error: any) =>
          Toast.show({ type: "error", text1: error?.message || "That code did not work" }),
      },
    );
  };

  return (
    <AuthLayout
      heading="Verify your email"
      description={email ? `We sent a 6-digit code to ${email}.` : "Enter the 6-digit code we emailed you."}
      href="/login"
      prompt="Wrong email?"
      action="Start over"
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
      <Button text="Verify email" size="lg" onPress={handleVerify} loading={isPending} />
    </AuthLayout>
  );
}
