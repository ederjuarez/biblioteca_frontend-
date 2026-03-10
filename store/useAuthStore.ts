import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { AuthState } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refresh: null,
  isLoading: true, // 1. Empezamos en true para bloquear la navegación inicial

  login: async (token, refresh, userData) => {
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("refreshToken", refresh);
    set({ token, refresh, user: userData, isLoading: false });
  },

  logout: async () => {
    console.log("ENTRA AL LOGOUT");
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
    set({ token: null, refresh: null, user: null, isLoading: false });
  },

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      // 2. Seteamos el token (si existe) y SIEMPRE apagamos isLoading
      set({ token, isLoading: false });
    } catch (error) {
      console.error("Error cargando el token:", error);
      set({ isLoading: false });
    }
  },
}));
