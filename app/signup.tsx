import React, { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useSignupMutation } from "@/hooks/useUser";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const router = useRouter();
  const { mutate, isPending } = useSignupMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!EMAIL.test(email.trim())) {
      Toast.show({ type: "error", text1: "Enter a valid email address" });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: "error", text1: "Use at least 6 characters" });
      return;
    }

    mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Check your inbox for the code" });
          router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
        },
        onError: (error: any) =>
          Toast.show({ type: "error", text1: error?.message || "Could not create the account" }),
      },
    );
  };

  return (
    <AuthLayout
      heading="Create an account"
      description="One account for orders, saved addresses and wishlists."
      href="/login"
      prompt="Already have an account?"
      action="Login"
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

      <Input
        label="Password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
      />

      <Button text="Create an account" size="lg" onPress={handleSignup} loading={isPending} />
    </AuthLayout>
  );
}
