import React, { useState } from "react";
import { StyleSheet, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginResponse } from "@/types/auth";
import { TextInput, Button as BtnPaper, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/types/theme";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const theme = useAppTheme();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/token/", {
        username,
        password,
      });
      console.log("Autenticación exitosa =>", data);
      const { access, refresh, user } = data;
      await login(access, refresh, user || { id: 1, username }, true);
      router.replace("/(main)/(tabs)/authors");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        mode="outlined"
        label="Nombre de usuario"
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <BtnPaper mode="contained" onPress={() => handleLogin()} loading={loading}>
        Iniciar Sesión
      </BtnPaper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    color: "#000",
    fontWeight: "bold",
  },
});
