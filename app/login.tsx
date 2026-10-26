import React from "react";
import { StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, Link } from "expo-router";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import GoogleButton from "@/components/ui/google-button";
import Text from "@/components/ui/text";
import AuthLayout, { OrDivider } from "@/layout/auth-layout";
import { useLoginMutation } from "@/hooks/useUser";
import { useGoogleLogin } from "@/hooks/useGoogleAuth";
import { MailIcon } from "@/assets/icons/mail-icon";
import { LockIcon } from "@/assets/icons/lock-icon";
import { colors } from "@/constant/color";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "At least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { mutate, isPending } = useLoginMutation();
  const { startGoogleLogin, isPending: isGooglePending } = useGoogleLogin();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: (data) => {
        Toast.show({ type: "success", text1: data?.message || "Logged in" });
        router.replace("/home");
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Something went wrong",
        });
      },
    });
  });

  return (
    <AuthLayout
      heading="Welcome back"
      description="Login to your EZ Shop account"
      prompt="Don't have an account?"
      action="Create account"
      href="/signup"
    >
      <GoogleButton onPress={startGoogleLogin} loading={isGooglePending} />

      <OrDivider />

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            icon={<MailIcon color={colors.muted} size={20} />}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Password"
            icon={<LockIcon color={colors.muted} size={20} />}
            placeholder="Enter your password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            labelAction={
              <Link href="/forgot-password" style={styles.forgot}>
                <Text size={14} weight="600" color="brand">
                  Forgot password?
                </Text>
              </Link>
            }
            error={formState.errors.password?.message}
          />
        )}
      />

      <Button text="Login" size="lg" onPress={onSubmit} loading={isPending} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: {
    marginTop: -2,
  },
});
