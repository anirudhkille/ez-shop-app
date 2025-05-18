import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUpdateProfileMutation } from "@/hooks/useUser";
// import Toast from "react-native-toast-message";

export default function editprofile() {
  const [name, setName] = useState("");
  const { mutate } = useUpdateProfileMutation();

  const hanldeUpdate = async () => {
    // mutate(token,name, {
    //   onSuccess: (data) => {
    //     Toast.show({
    //       type: "success",
    //       text1: data?.message,
    //     });
    //   },
    //   onError: (error: any) => {
    //     Toast.show({
    //       type: "error",
    //       text1: error?.message || "Something went wrong",
    //     });
    //   },
    // });
  };

  return (
    <>
      <Header title="Edit Profile" />
      <Container extraStyle={styles.container}>
        <Input
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Button text="Save" onPress={hanldeUpdate} />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
