import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Container from "@/layout/Container";
import { useVerifySignupOTPMutation } from "@/hooks/useUser";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import Toast from "react-native-toast-message";

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate, isPending } = useVerifySignupOTPMutation();
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (!otp || otp.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: data?.message || "Email verified successfully",
          });
          router.replace("/(tabs)/home");
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error?.message || "Verification failed",
          });
        },
      }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Container>
        <Text size={22} weight="600" align="center">
          Verify OTP
        </Text>
        <Text color="accent" align="center">
          Enter the OTP sent to {email}
        </Text>
        <Input label="OTP" value={otp} onChangeText={setOtp} placeholder="Enter 6-digit OTP" />
        <Button text="Verify" onPress={handleVerify} loading={isPending} />
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
