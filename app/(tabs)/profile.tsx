import { StyleSheet, View } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import { Link, useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Button from "@/components/ui/Button";
import { Image } from "expo-image";
import Text from "@/components/ui/Text";
import { SettingsIcon } from "@/assets/icons/SettingsIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";

export default function profile() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  return (
    <Container extraStyle={{ paddingTop: 40, gap: 20 }}>
      <Image
        style={styles.image}
        source="https://picsum.photos/seed/696/3000/2000"
      />
      <Text align="center" size={24} weight="500">
        Anirudh Kille
      </Text>

      <View style={{ width: 150, marginHorizontal: "auto" }}>
        <Button
          text="Edit profile"
          variant="outline"
          onPress={() => router.push("/edit-profile")}
        />
      </View>

      <View style={styles.options}>
        <View style={styles.option}>
          <PackageIcon color={themeColors.primary} size={30} />
          <Text align="center">Orders</Text>
        </View>

        <Text
          style={{
            borderLeftColor: themeColors.border,
            borderLeftWidth: 1,
            marginVertical: 5,
            color: themeColors.background,
          }}
        >
          |
        </Text>

        <Link href="/settings" >
          <View style={styles.option}>
            <SettingsIcon color={themeColors.primary} size={30} />
            <Text align="center">Settings</Text>
          </View>
        </Link>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#0553",
    marginHorizontal: "auto",
  },
  options: {
    padding: 20,
    margin: 20,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    maxWidth: 500,
    marginHorizontal: "auto",
    width: "100%",
  },
  option: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
});
