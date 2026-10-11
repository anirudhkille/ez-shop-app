import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useRouter } from "expo-router";
import { useSignupMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function Signup() {
  const router = useRouter();
  const { mutate, isPending } = useSignupMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = () => {
    mutate(formData, {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data?.message,
        });
        router.push(`/verify-otp?email=${formData.email}`);
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <AuthLayout
      heading="Create an account"
      description="Enter your details to create a new account"
      href="/login"
      prompt="Already have an account?"
      action="Login"
    >
      <Input
        value={formData.email}
        label="Email"
        onChangeText={(text) => handleChange("email", text)}
      />

      <Input
        label="Password"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <Button text="Create an account" onPress={handleSignup} loading={isPending} />
    </AuthLayout>
  );
}
