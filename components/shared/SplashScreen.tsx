import Container from "@/layout/Container";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Text from "../ui/Text";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [logoScale] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.timing(logoScale, {
      toValue: 1,
      duration: 3000, // Duration of the animation in milliseconds
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Optional: Add a delay before calling onFinish
      setTimeout(() => {
        onFinish(); // Callback to signal that the splash screen is done
      }, 500); // Example: Wait for 500ms after the animation
    });
  }, [logoScale, onFinish]);

  const logoStyle = {
    transform: [{ scale: logoScale }],
  };

  return (
    <Container extraStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.Image
        source={require("@/assets/images/icon.png")} // Replace with your logo path
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      <View style={styles.caption}>
        <Text color="accent">from</Text>
        <Text weight="600" size={22}>Anirudh Kille</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  caption: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
});
