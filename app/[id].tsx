import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={styles.body}>
        <Input
          label="Name"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 24,
  },
});
