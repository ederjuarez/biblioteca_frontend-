import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Icon, List, Text } from "react-native-paper";
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
  const { authorId } = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    try {
      authorId &&
        api.get(`/books_author/${authorId}/`, {
          params: {
            page: currentPage,
          },
        }).then((response) => {
          response.data = response.data.filter(
            (book: Book) => !books.some((b) => b.id === book.id)
          );
          setBooks((prev) => [...prev, ...response.data]);
          // setHasMore(response.data.links.next);
        });
    } catch (error) {
      console.log("Error fetching books =>", error);
    }
  }, [authorId, currentPage]);


  const Item = (book: Book) => (
    <List.Item
      title={book.title}
      description={() => (
        <>
          <Text>Autor: {book.author_name}</Text>
          <Text>ISBN: {book.isbn}</Text>
          <Text>Precio: ${book.price.toFixed(2)}</Text>
        </>
      )}
      right={props => <Icon source="book-open-variant" {...props} size={40} color={theme.colors.secondary} />}
      style={styles.item}
      titleStyle={styles.itemTitle}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Lista de libros</Text>

      <FlatList
        style={styles.list}
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item {...item} />}
      />

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
  list: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
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
  itemTitle: {
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    fontWeight: "bold",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});
