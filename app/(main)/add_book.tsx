import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Alert, Image, View, TouchableOpacity, Keyboard, Modal, FlatList, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, Searchbar, List, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "@/api/axios";
import { useRouter } from "expo-router";

export default function AddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Date picker state
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Author Search & Pagination state
  const [authors, setAuthors] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMoreAuthors, setHasMoreAuthors] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const router = useRouter();

  const fetchAuthors = async (query = "", pageParam = 1, append = false) => {
    if (loadingAuthors && pageParam === 1) return;
    setLoadingAuthors(true);
    try {
      const response = await api.get(`/authors/`, {
        params: { search: query, page: pageParam },
      });
      const results = response.data.results || response.data;
      if (append) {
        setAuthors(prev => [...prev, ...results]);
      } else {
        setAuthors(results);
      }
      setHasMoreAuthors(!!response.data.next);
    } catch (err) {
      console.log("Error fetching authors", err);
    } finally {
      setLoadingAuthors(false);
    }
  };

  useEffect(() => {
    fetchAuthors(searchQuery, 1, false);
    setPage(1);
  }, [searchQuery]);

  const loadMoreAuthors = () => {
    if (hasMoreAuthors && !loadingAuthors) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAuthors(searchQuery, nextPage, true);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso Denegado", "Se requiere acceso a la galería para seleccionar una portada.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keep showing on iOS, auto-hide on Android
    setDate(currentDate);

    // Format YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    setPublicationDate(`${year}-${month}-${day}`);
  };

  const handleSaveBook = async () => {
    if (!title || !author || !publicationDate || !isbn || !price) {
      Alert.alert("Error", "Todos los campos (excepto la imagen) son obligatorios");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author); // author id
    formData.append("publication_date", publicationDate); // YYYY-MM-DD expected
    formData.append("isbn", isbn);
    formData.append("price", price);

    if (imageUri) {
       // Extract filename from URI
      const filename = imageUri.split('/').pop() || "portada.jpg";
      // Determine type based on extension
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("portada", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);
    }

    try {
      await api.post("/books/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("guardado correctamente");
      setLoading(false);
      setTitle("");
      setAuthor("");
      setPublicationDate("");
      setIsbn("");
      setPrice("");
      setImageUri(null);
      router.replace("/(main)/(tabs)/books");
    } catch (error: any) {
      console.log("Error guardando =>", error?.response?.data || error);
      Alert.alert("Error", "Ocurrió un error al guardar el libro");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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
        
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(true);
            if (authors.length === 0) fetchAuthors("", 1, false);
          }}
          activeOpacity={0.8}
        >
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              label="Autor"
              value={authors.find(a => a.id === author)?.name || (author ? "Autor Seleccionado" : "")}
              placeholder="Selecciona un autor"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />
          </View>
        </TouchableOpacity>

        {/* Modal para Buscar Autor */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Buscar Autor</Text>
                <IconButton icon="close" onPress={() => setModalVisible(false)} />
              </View>
              <Searchbar
                placeholder="Buscar por nombre..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
              />
              <FlatList
                data={authors}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.name}
                    titleStyle={{ textAlign: 'center' }}
                    style={styles.authorListItem}
                    onPress={() => {
                      setAuthor(item.id);
                      setModalVisible(false);
                    }}
                  />
                )}
                onEndReached={loadMoreAuthors}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingAuthors ? <ActivityIndicator style={{ margin: 10 }} /> : null}
                ListEmptyComponent={!loadingAuthors ? <Text style={{ textAlign: 'center', marginTop: 20 }}>No se encontraron autores.</Text> : null}
              />
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              label="Fecha de publicacion (YYYY-MM-DD)"
              value={publicationDate}
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
            />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {/* Modal for iOS Date Picker explicitly (optional, often needed since iOS picker renders inline) */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Button onPress={() => setShowDatePicker(false)}>Confirmar Fecha</Button>
        )}

        <TextInput
          mode="outlined"
          label="Precio"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
          {imageUri ? "Cambiar Portada" : "Seleccionar Portada"}
        </Button>
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        <Button
          mode="contained"
          onPress={() => handleSaveBook()}
          loading={loading}
          style={styles.saveButton}
        >
          Guardar Libro
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  imageButton: {
    marginTop: 8,
  },
  previewImage: {
    width: 100,
    height: 150,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchbar: {
    marginBottom: 10,
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  authorListItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
