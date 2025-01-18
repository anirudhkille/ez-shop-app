import Button from "@/components/ui/Button";
import { colors } from "@/constant/color";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flexDirection: "column", gap: 10, marginBottom: 60 }}>
          <Text style={styles.heading}>Welcome to EZ SHOP.</Text>
          <Text style={styles.description}>
            Discover the ultimate shopping experience with EZ SHOP. Browse a
            wide range of products, enjoy exclusive deals, and shop with ease
            from the comfort of your home.
          </Text>
        </View>
        <Button text="Continue" onPress={() => router.push("/login")} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "600",
  },
  description: {
    color: "#71717a",
  },
});
