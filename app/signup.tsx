import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useRouter } from "expo-router";
import { useSignupMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function signup() {
  const router = useRouter();
  const { mutate } = useSignupMutation();
  const [formData, setFormData] = useState({
    name: "",
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
        router.push("/home");
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
      linkText="   Already have an account? Login"
    >
      <Input
        value={formData.name}
        label="Name"
        onChangeText={(text) => handleChange("name", text)}
      />

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

      <Button text="Create an account" onPress={handleSignup} />
    </AuthLayout>
  );
}
