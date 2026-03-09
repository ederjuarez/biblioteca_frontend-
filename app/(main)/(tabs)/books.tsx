import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { List, Text, FAB } from "react-native-paper";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ListItem = List.Item;

interface Book {
  id: number;
  title: string;
  isbn: string;
  author_name: string;
  price: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      api.get("/books/").then((response) => {
        setBooks(response.data);
      });
    } catch (error) {
      console.log("Error fetching authors =>", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge">Lista de libros</Text>
      {books.map((book) => (
        <ListItem
          key={book.id}
          title={<Text variant="titleSmall">{book.title}</Text>}
          description={() => (
            <>
              <Text>Nombre: {book.author_name}</Text>
              <Text>ISBN: {book.isbn}</Text>
              <Text>Price: ${book.price.toFixed(2)}</Text>
            </>
          )}
          right={(props) => (
            <TouchableOpacity onPress={() => console.log("Ir a libros")}>
              <List.Icon {...props} icon="book" />
            </TouchableOpacity>
          )}
        />
      ))}
      <FAB
        icon={"plus"}
        label={"Agregar Libro"}
        onPress={() => router.push("/(main)/add_book")}
        visible={true}
        style={[styles.fabStyle]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 32,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});
