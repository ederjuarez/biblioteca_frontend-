import { useState } from "react";
import { StyleSheet, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import api from "@/api/axios";
import { useRouter } from "expo-router";

export default function AddBookPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSaveAuthor = () => {
    if (!name || !birthDate || !biography) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    let data = {
      name: name,
      birth_date: birthDate,
      biography: biography,
    };
    try {
      api.post("/books/", data).then((response) => {
        console.log("guardado =>", response);
        setLoading(false);
        setName("");
        setBirthDate("");
        setBiography("");
        router.replace("/(main)/(tabs)/authors");
      });
    } catch (error) {
      console.log("Error guardando =>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Add Author Page</Text>
      <TextInput
        mode="outlined"
        label="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        mode="outlined"
        label="Fecha de nacimiento"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        mode="outlined"
        label="Biografía"
        value={biography}
        onChangeText={setBiography}
        multiline
        numberOfLines={4}
      />
      <Button
        mode="contained"
        onPress={() => handleSaveAuthor()}
        loading={loading}
      >
        Guardar Autor
      </Button>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
