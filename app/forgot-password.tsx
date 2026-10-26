import React, { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layout";
import { useForgotPasswordMutation } from "@/hooks/useUser";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const router = useRouter();
  const { mutate, isPending } = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!EMAIL.test(email.trim())) {
      Toast.show({ type: "error", text1: "Enter a valid email address" });
      return;
    }

    mutate(email.trim(), {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Your reset code is on the way" });
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      },
      onError: (error: any) =>
        Toast.show({ type: "error", text1: error?.message || "Could not send the code" }),
    });
  };

  return (
    <AuthLayout
      heading="Forgot password"
      description="We will email you a 6-digit code to reset it."
      href="/login"
      prompt="Remembered it?"
      action="Back to login"
    >
      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Button text="Send code" size="lg" onPress={handleSubmit} loading={isPending} />
    </AuthLayout>
  );
}
