import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useLoginMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const { mutate, error, data } = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
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
