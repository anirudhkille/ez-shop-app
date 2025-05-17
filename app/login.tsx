import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useLoginMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function login() {
  const router = useRouter();
  const { mutate } = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    mutate(formData, {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: data?.message,
        });
        router.push("/home");
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <AuthLayout
      heading="Login"
      description="Enter your email and password to login"
      href="/signup"
      linkText="Don't have an account? Sign Up"
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

      <Button text="Login" onPress={handleLogin} />
    </AuthLayout>
  );
}
