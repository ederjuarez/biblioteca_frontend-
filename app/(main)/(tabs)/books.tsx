import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, List, Text } from "react-native-paper";
import { theme } from "@/types/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export interface Book {
  id: number;
  title: string;
  author: string;
  author_name: string;
  isbn: string;
  publication_date: string;
  price: number;
  available: boolean;
  portada: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const { author_id } = useLocalSearchParams();

  useEffect(() => {
    try {
      author_id &&
        api.get(`/books_author/${author_id}/`).then((response) => {
          setBooks(response.data);
        });
    } catch (error) {
      console.log("Error fetching books =>", error);
    }
  }, [author_id]);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Lista de libros</Text>
      {books.map((book) => (
        <List.Item
          key={book.id}
          title={book.title}
          description={() => (
            <>
              <Text>Autor: {book.author_name}</Text>
              <Text>ISBN: {book.isbn}</Text>
              <Text>Precio: ${book.price.toFixed(2)}</Text>
            </>
          )}
          right={props => <MaterialCommunityIcons name="book" {...props} size={40} />}
          style={styles.item}
        />
      ))}
      <FAB
        label="Agregar libro"
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => console.log("Agregar libro")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    color: "#000",
    fontWeight: "bold",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  fab: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    fontWeight: "bold",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
