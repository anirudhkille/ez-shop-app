import React, { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layout";
import { useSignupMutation } from "@/hooks/useUser";
import { UserIcon } from "@/assets/icons/user-icon";
import { MailIcon } from "@/assets/icons/mail-icon";
import { LockIcon } from "@/assets/icons/lock-icon";
import { colors } from "@/constant/color";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const router = useRouter();
  const { mutate, isPending } = useSignupMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (name.trim().length < 2) {
      Toast.show({ type: "error", text1: "Please enter your name" });
      return;
    }
    if (!EMAIL.test(email.trim())) {
      Toast.show({ type: "error", text1: "Enter a valid email address" });
      return;
    }
    if (password.length < 8) {
      Toast.show({ type: "error", text1: "Use at least 8 characters" });
      return;
    }

    mutate(
      { name: name.trim(), email: email.trim(), password },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Check your inbox for the code" });
          router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
        },
        onError: (error: any) =>
          Toast.show({ type: "error", text1: error?.message || "Could not create the account" }),
      }
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
        label="Name"
        icon={<UserIcon color={colors.muted} size={20} />}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
      />

      <Input
        label="Email"
        icon={<MailIcon color={colors.muted} size={20} />}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <Input
        label="Password"
        icon={<LockIcon color={colors.muted} size={20} />}
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
      />

      <Button text="Create an account" size="lg" onPress={handleSignup} loading={isPending} />
    </AuthLayout>
  );
}
