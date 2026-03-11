import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, FAB, Icon, List, Text } from "react-native-paper";
import { theme } from "@/types/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      setBooks([]);
      setCurrentPage(1);
      try {
        setLoading(true);
        api.get(`/books/`, {
          params: {
            ...(authorId && { author_id: authorId }),
            page: currentPage,
          },
          signal: controller.signal,
        }).then((response) => {
          const filtered = response?.data?.results?.filter(
            (book: Book) => !books.some((b) => b.id === book.id)
          );
          setBooks((prev) => [...prev, ...(filtered || [])]);
          setHasMore(response.data?.links?.next);
        });
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.log("Error fetching books =>", error.message);
        }
      } finally {
        setLoading(false);
      }
      return () => controller.abort();
    }, [authorId, currentPage])
  );

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
      right={props => <Avatar.Image size={70} source={{ uri: book.portada }} style={styles.avatar} />}
      style={styles.item}
      titleStyle={styles.itemTitle}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Lista de libros</Text>

      <FlatList
        style={styles.list}
        onEndReached={() => hasMore && !loading && setCurrentPage(currentPage + 1)}
        onEndReachedThreshold={0.5}
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item {...item} />}
        ListFooterComponent={
          <Text variant="bodyMedium" style={styles.footerText}>
            {loading ? "Cargando..." : (books.length === 0 && "No hay libros")}
          </Text>
        }
      />

      <FAB
        label="Agregar libro"
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push("/(main)/add_book")}
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
  avatar: {
    marginLeft: 16,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
