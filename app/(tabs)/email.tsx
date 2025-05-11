import React from "react";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Header from "@/layout/Header";

export default function email() {

  return (
    <>
      <Header title="Email" />
      <Container extraStyle={{ paddingTop: 20, paddingHorizontal: 0 }}>
        <Text align="center">Your current account email address is</Text>
      </Container>
    </>
  );
}


