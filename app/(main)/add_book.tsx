import { useState } from "react";
import { StyleSheet, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import api from "@/api/axios";
import { useRouter } from "expo-router";

export default function AddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSaveBook = () => {
    if (!title || !author || !publicationDate || !isbn || !price) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    let data = {
      title: title,
      author: author,
      publication_date: publicationDate,
      isbn: isbn,
      price: price,
      image: image,
    };
    try {
      api.post("/books/", data).then((response) => {
        console.log("guardado =>", response);
        setLoading(false);
        setTitle("");
        setAuthor("");
        setPublicationDate("");
        setIsbn("");
        setPrice("");
        setImage("");
        router.replace("/(main)/(tabs)/books");
      });
    } catch (error) {
      console.log("Error guardando =>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        mode="outlined"
        label="Titulo"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        mode="outlined"
        label="Isbn"
        value={isbn}
        onChangeText={setIsbn}
      />
      <TextInput
        mode="outlined"
        label="Autor"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        mode="outlined"
        label="Fecha de publicacion"
        value={publicationDate}
        onChangeText={setPublicationDate}
      />
      <TextInput
        mode="outlined"
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        mode="outlined"
        label="Imagen"
        value={image}
        onChangeText={setImage}
      />
      <Button
        mode="contained"
        onPress={() => handleSaveBook()}
        loading={loading}
      >
        Guardar Libro
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
