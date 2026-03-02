import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginResponse } from "@/types/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    // Aquí puedes agregar la lógica de autenticación, por ejemplo, hacer una solicitud a tu backend
    try {
      const { data } = await api.post<LoginResponse>("/token/", {
        username,
        password,
      });
      console.log("Autenticación exitosa =>", data);
      const { access, refresh, user } = data;
      await login(access, refresh, user || { id: 1, username }, true);
      router.replace("/(main)/profile"); // Redirige a la página principal después del login
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={() => handleLogin()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
