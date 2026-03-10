import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen name="add_book" options={{ title: "Agregar Libro" }} />
      <Stack.Screen name="add_author" options={{ title: "Agregar Autor" }} />
    </Stack>
  );
}
