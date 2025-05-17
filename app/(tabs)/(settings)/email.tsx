import React, { useState } from "react";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Header from "@/layout/Header";
import { StyleSheet, View } from "react-native";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function email() {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {};

  return (
    <>
      <Header title="Email" />
      <Container>
        <Text align="center">Your current account email address is</Text>
        <Text align="center" size={18}>
          test@gmail.com
        </Text>

        <View style={{ flexDirection: "column", gap: 20, marginTop: 40 }}>
          <Input
            placeholder="New Email Address"
            size="md"
            value={formData.email}
            onChangeText={(e) => handleChange("email", e)}
          />
          <Input
            placeholder="Confirm Email Address"
            size="md"
            value={formData.confirmEmail}
            onChangeText={(e) => handleChange("confirmEmail", e)}
          />
          <Button text="Done" onPress={handleSubmit} />
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
  },
});
