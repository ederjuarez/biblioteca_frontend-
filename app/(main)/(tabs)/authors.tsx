import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, FlatList } from "react-native";
import { List, Text } from "react-native-paper";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";

const ListItem = List.Item;

interface Author {
  id: number;
  name: string;
  birth_date: string;
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState("");
  console.log("Current page:", currentPage);

  useEffect(() => {
    try {
      api
        .get("/authors/", {
          params: {
            page: currentPage,
          },
        })
        .then((response) => {
          setAuthors((prev) => [...prev, ...response.data.results]);
          console.log("Fetched authors =>", response.data.links.next);
          setHasMore(response.data.links.next);
        });
    } catch (error) {
      console.log("Error fetching authors =>", error);
    }
  }, [currentPage]);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge">Lista de autores</Text>
      <FlatList
        data={authors}
        renderItem={({ item }) => (
          <ListItem title={item.name} description={item.birth_date} />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => hasMore && setCurrentPage((prev) => prev + 1)}
        onEndReachedThreshold={0.5}
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
});
