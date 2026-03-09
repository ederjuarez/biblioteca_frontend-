import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { List, Text, MD3Colors } from "react-native-paper";
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

  useEffect(() => {
    try {
      api.get("/authors/").then((response) => {
        setAuthors(response.data.results);
      });
    } catch (error) {
      console.log("Error fetching authors =>", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge">Lista de autores</Text>
      {authors.map((author) => (
        <ListItem
          key={author.id}
          title={author.name}
          description={author.birth_date}
          right={(props) => (
            <TouchableOpacity onPress={() => console.log("Ir a libros")}>
              <List.Icon
                {...props}
                color={MD3Colors.primary60}
                icon="bookshelf"
              />
            </TouchableOpacity>
          )}
        />
      ))}
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
