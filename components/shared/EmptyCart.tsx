import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "../ui/Button";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Container from "@/layout/Container";
import Text from "../ui/Text";

interface EmptyPageProps {
  text1: string;
  text2: string;
  Icon: any;
}

export default function EmptyPage({ text1, text2, Icon }: EmptyPageProps) {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  const handlePres = () => router.push("/home");

  return (
    <Container extraStyle={{ justifyContent: "center", alignItems: "center" }}>
      <View style={[styles.iconContainer, { borderColor: themeColors.border }]}>
        <Icon strokeWidth={1} size={30} color={themeColors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text align="center">{text1}</Text>
        <Text align="center">{text2}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handlePres} text="Shop Now" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderWidth: 1.5,
    borderRadius: 9999,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    display: "flex",
    gap: 5,
    marginTop: 10,
    alignItems: "center",
    padding: 20,
  },
  text: { fontWeight: 400, fontSize: 18, textAlign: "center" },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
});
