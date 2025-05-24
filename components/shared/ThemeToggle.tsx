import { useRef, useState } from "react";
import { View, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Theme, useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "../ui/Text";
import Button from "../ui/Button";

interface ThemeToggleProps {
  index: number;
  onChangeIndex: (index: number) => void;
}

export default function ThemeToggle({
  index = -1,
  onChangeIndex,
}: ThemeToggleProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { appliedTheme, setTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  const [selectedTheme, setSelectedTheme] = useState<Theme>(appliedTheme);

  const handleSave = () => {
    setTheme(selectedTheme as Theme);
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}
      handleStyle={{ backgroundColor: themeColors.background }}
      enablePanDownToClose
      onClose={() => onChangeIndex(-1)}
      backgroundStyle={{ backgroundColor: themeColors.background }}
      handleIndicatorStyle={{ backgroundColor: themeColors.primary }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={{ padding: 20, gap: 20 }}>
        {["light", "dark", "system"].map((option) => (
          <Pressable
            key={option}
            onPress={() => setSelectedTheme(option as Theme)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text color="primary">
              {option === "light"
                ? "Light Theme"
                : option === "dark"
                  ? "Dark Theme"
                  : "System Theme"}
            </Text>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: themeColors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedTheme === option && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: themeColors.primary,
                  }}
                />
              )}
            </View>
          </Pressable>
        ))}

        <Button onPress={handleSave} text="Save preference" />
      </BottomSheetView>
    </BottomSheet>
  );
}
