import { StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/hooks/useUser";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const { data: profileRes } = useProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const user = profileRes?.data;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = () => {
    updateProfile(
      { name, phone },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Profile updated successfully" });
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.message || "Failed to update profile",
          });
        },
      }
    );
  };

  return (
    <>
      <Header title="Edit Profile" />
      <Container extraStyle={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Phone" value={phone} onChangeText={setPhone} />
          <Button text="Save" onPress={handleSave} loading={isPending} />
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
