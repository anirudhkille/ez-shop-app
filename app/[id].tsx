import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import { useLocalSearchParams } from "expo-router";

export default function editprofile() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header title="Edit Profile" />
      <Container>
        <Input
          label="Name"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({});
