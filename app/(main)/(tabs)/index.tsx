import React from "react";
import { View, Text, Button } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";

export default function Index() {
  const logout = useAuthStore((state) => state.logout);
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Welcome to the Biblioteca App!</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}
