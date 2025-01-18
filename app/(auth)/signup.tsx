import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useRouter } from "expo-router";
import { useSignupMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function Signup() {
  const router = useRouter();
  const { mutate, error, data } = useSignupMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = () => {
    mutate(formData);

    Toast.show({
      type: error ? "error" : "success",
      text1: error ? "Error" : "Success",
      text2: error ? error?.message : data?.message,
    });

    if (data) {
      router.push("/home");
    }
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
