import { StyleSheet } from "react-native";
import React from "react";
import EmptyPage from "@/components/shared/EmptyCart";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";

export default function cart() {
  return (
    <>
      <EmptyPage
        text1="Your Bag is empty."
        text2="When you add products, they'll appear here."
        Icon={ShoppingBagIcon}
      />
    </>
  );
}

const styles = StyleSheet.create({});
