import { StyleSheet } from "react-native";
import React from "react";
import { ShoppingBag } from "lucide-react-native";
import EmptyPage from "@/components/shared/EmptyCart";

export default function cart() {
  return (
    <>
      <EmptyPage
        text1="Your Bag is empty."
        text2="When you add products, they'll appear here."
        Icon={ShoppingBag}
      />
    </>
  );
}

const styles = StyleSheet.create({});
