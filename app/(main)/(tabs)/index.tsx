import React from "react";
import { Button, Text } from "react-native-paper";
import { useAuthStore } from "@/store/useAuthStore";
import { View } from "react-native";

export default function Index() {
  const logout = useAuthStore((state) => state.logout);
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>Bienvenido a la Biblioteca App!</Text>
      <Button mode="contained" onPress={() => logout()}>
        Logout
      </Button>
    </View>
  );
}
