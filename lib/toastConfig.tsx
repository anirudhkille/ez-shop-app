import { colors } from "@/constant/color";
import { useThemeStore } from "@/store/theme";
import { CircleCheck, CircleX } from "lucide-react-native";
import { View, Text } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1 }: BaseToastProps) => {
    const theme = useThemeStore.getState().theme;
    const themeColors = colors[theme];

    return (
      <View
        style={{
          height: 60,
          width: "90%",
          maxWidth: 400,
          borderColor: themeColors.border,
          borderWidth: 1,
          gap: 10,
          borderRadius: 8,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CircleCheck color={themeColors.text} size={20} strokeWidth={1.5} />
        <Text style={{ color: themeColors.primary }}>{text1}</Text>
      </View>
    );
  },

  error: ({ text1 }: BaseToastProps) => {
    const theme = useThemeStore.getState().theme;
    const themeColors = colors[theme];

    return (
      <View
        style={{
          height: 60,
          width: "90%",
          maxWidth: 400,
          borderColor: themeColors.border,
          borderWidth: 1,
          gap: 10,
          borderRadius: 8,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CircleX color={themeColors.text} size={20} strokeWidth={1.5} />
        <Text style={{ color: themeColors.primary }}>{text1}</Text>
      </View>
    );
  },
};
