import {
  Slot,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initialize = useAuthStore((state) => state.initialize);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    console.log("isLoading =>", isLoading);
    console.log("token =>", token);
    // 1. Verificación Crítica: Si el router no está listo, no navegamos aún.
    if (!navigationState?.key || isLoading) return;

    // 2. Según tu imagen, la carpeta es "auth", no "(auth)"
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Si no hay sesión, al login. Nota: la ruta coincide con tu carpeta
      router.replace("/login");
    } else if (token && inAuthGroup) {
      // Si hay sesión y está en el login, a la raíz (index.tsx)
      router.replace("/(main)/(tabs)");
    }
  }, [token, navigationState?.key, segments, isLoading, router]);

  // 3. LA SOLUCIÓN AL ERROR:
  // Siempre debemos renderizar algo que inicialice el Router (Slot o Stack).
  // Si está cargando, mostramos un loader, pero fuera de esa condición devolvemos el Slot.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <PaperProvider>
    <Slot />
  </PaperProvider>;
}
