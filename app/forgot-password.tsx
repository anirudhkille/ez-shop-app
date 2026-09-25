import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/layout/AuthLayout";
import { useRouter } from "expo-router";
import { useForgotPasswordMutation } from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function ForgotPassword() {
  const router = useRouter();
  const { mutate, isPending } = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }
    mutate(email, {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data?.message || "OTP sent to your email",
        });
        router.push(`/reset-password?email=${email}`);
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
      heading="Forgot Password"
      description="Enter your email to receive an OTP"
      href="/login"
      linkText="Back to Login"
    >
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <Button text="Send OTP" onPress={handleSubmit} loading={isPending} />
    </AuthLayout>
  );
}
