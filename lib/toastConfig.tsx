import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { CircleXIcon } from "@/assets/icons/CircleXIcon";
import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { View, Text } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1 }: BaseToastProps) => {
    const { appliedTheme } = useThemeStore();
    const themeColors = colors[appliedTheme];

    return (
      <View
        style={{
          height: 60,
          width: "90%",
          maxWidth: 400,
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
          borderWidth: 1,
          gap: 10,
          borderRadius: 8,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CircleCheckIcon color={themeColors.primary} size={20} />
        <Text style={{ color: themeColors.primary }}>{text1}</Text>
      </View>
    );
  },

  error: ({ text1 }: BaseToastProps) => {
    const { appliedTheme } = useThemeStore();
    const themeColors = colors[appliedTheme];

    return (
      <View
        style={{
          height: 60,
          width: "90%",
          maxWidth: 400,
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
          borderWidth: 1,
          gap: 10,
          borderRadius: 8,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CircleXIcon color={themeColors.primary} size={20} />
        <Text style={{ color: themeColors.primary }}>{text1}</Text>
      </View>
    );
  },
};
