import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, List, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { useRouter } from "expo-router";

export interface Author {
  id: number;
  name: string;
  biography: string;
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      api.get("/authors/", {
        params: {
          page: currentPage,
        },
      }).then((response) => {
        response.data.results = response.data.results.filter(
          (author: Author) => !authors.some((a) => a.id === author.id)
        );
        setAuthors((prev) => [...prev, ...response.data.results]);
        setHasMore(response.data.links.next);
      });
    } catch (error) {
      console.log("Error fetching authors =>", error);
    }
  }, [currentPage]);

  const handlePress = (id: number) => {
    router.push({
      pathname: "/(main)/(tabs)/books/" as any,
      params: {
        authorId: id,
      },
    });
  };

  const Item = ({ name, biography, id }: Author) => (
    <List.Item
      title={name}
      description={biography}
      right={props => <TouchableOpacity onPress={() => handlePress(id)}><MaterialCommunityIcons name="bookshelf" {...props} size={40} color={theme.colors.primary} /></TouchableOpacity>}
      style={styles.item}
      titleStyle={styles.itemTitle}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Lista de autores</Text>
      <FlatList
        style={styles.list}
        data={authors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item {...item} />}
        onEndReached={() => hasMore && setCurrentPage((prev) => prev + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <Text variant="bodyMedium" style={styles.footerText}>
            {hasMore ? "Cargando más..." : "No hay más autores"}
          </Text>
        }
      />
      <FAB
        label="Agregar autor"
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push("/(main)/add_author")}
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
    borderBottomColor: "#ccc",
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
