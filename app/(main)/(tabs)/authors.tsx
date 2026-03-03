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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Author {
  id: number;
  name: string;
}

type ItemProps = { name: string };

const Item = ({ name }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{name}</Text>
    <TouchableOpacity style={{ marginLeft: "auto" }}>
      <Text style={{ color: "white" }}>Ver Libros</Text>
    </TouchableOpacity>
  </View>
);

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    try {
      api.get("/authors/").then((response) => {
        setAuthors(response.data);
      });
    } catch (error) {
      console.log("Error fetching authors =>", error);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Lista de autores</Text>
        <FlatList
          data={authors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Item name={item.name} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
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
