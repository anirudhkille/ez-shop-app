import { View,  } from "react-native";
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return <View className={"p-3 rounded-lg"}>{children}</View>;
}
