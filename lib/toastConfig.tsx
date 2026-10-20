import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { CircleXIcon } from "@/assets/icons/CircleXIcon";
import Text from "@/components/ui/Text";
import { colors, radius } from "@/constant/color";
import { View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

function buildToast(accent: string, Icon: typeof CircleCheckIcon) {
  return ({ text1, text2 }: BaseToastProps) => (
    <View
      style={{
        width: "90%",
        maxWidth: 400,
        minHeight: 56,
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        gap: 12,
        borderRadius: radius.md,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Icon color={accent} size={20} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={14} weight="500">
          {text1}
        </Text>
        {text2 ? (
          <Text size={12} color="muted">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export const toastConfig = {
  success: buildToast(colors.success, CircleCheckIcon),
  error: buildToast(colors.destructive, CircleXIcon),
};