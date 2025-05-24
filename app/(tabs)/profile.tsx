import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Container from "@/layout/Container";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import { Image } from "expo-image";
import Text from "@/components/ui/Text";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon";
import { PaletteIcon } from "@/assets/icons/PaletteIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function profile() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const router = useRouter();
  const [sheetIndex, setSheetIndex] = useState(-1);

  return (
    <>
      <Container extraStyle={{ paddingTop: 40, gap: 20 }}>
        <Image
          style={styles.image}
          source="https://picsum.photos/seed/696/3000/2000"
        />
        <Text align="center" size={24} weight="500">
          Anirudh Kille
        </Text>

        <View style={styles.lists}>
          <Lists
            text="Your Profile"
            Icon={<UserIcon color={themeColors.primary} />}
            onPress={() => router.push("/profile/edit-profile")}
          />
          <Lists
            text="Appearance"
            Icon={<PaletteIcon color={themeColors.primary} />}
            onPress={() => setSheetIndex(0)}
          />

          <Lists
            text="Logout"
            Icon={<LogoutIcon color={themeColors.primary} />}
            onPress={() => router.push("/")}
          />
        </View>
      </Container>

      <ThemeToggle
        index={sheetIndex}
        onChangeIndex={(index) => setSheetIndex(index)}
      />
    </>
  );
}

function Lists({
  text,
  Icon,
  onPress,
}: {
  text: string;
  Icon: any;
  onPress: () => void;
}) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <TouchableOpacity
      style={[styles.list, { backgroundColor: themeColors.card }]}
      onPress={onPress}
    >
      <View style={{ gap: 10, alignItems: "center", flexDirection: "row" }}>
        {Icon}
        <Text color="primary">{text}</Text>
      </View>
      <ChevronRightIcon />
    </TouchableOpacity>
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
  lists: {
    marginTop: 10,
    gap: 20,
  },
  list: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
  },
});
