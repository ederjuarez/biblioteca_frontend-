import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import api from "@/api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

interface Book {
  id: number;
  title: string;
}

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity style={{ marginLeft: "auto" }}>
      <Text style={{ color: "white" }}>Ver Libros</Text>
    </TouchableOpacity>
  </View>
);

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);

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
      <Text>Lista de autores</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item title={item.title} />}
      />
      <Link href="/add_book">
        <Text style={{ color: "blue", marginTop: 20 }}>Agregar Libro</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#3eb3f2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
  },
});
