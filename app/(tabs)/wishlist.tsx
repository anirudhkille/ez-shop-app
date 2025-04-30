import React from "react";
import EmptyPage from "@/components/shared/EmptyCart";
import { Heart } from "lucide-react-native";

export default function wishlist() {
  return (
    <>
      <EmptyPage
        text1="Your Bag is empty."
        text2="When you add products, they'll appear here."
        Icon={Heart}
      />
    </>
  );
}
