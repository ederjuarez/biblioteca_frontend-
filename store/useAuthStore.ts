import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { AuthState } from "@/types/auth";
import { Platform } from "react-native";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refresh: null,
  isLoading: true, // 1. Empezamos en true para bloquear la navegación inicial

  login: async (token, refresh, userData) => {
    await setStoreKey("userToken", token);
    await setStoreKey("refreshToken", refresh);
    set({ token, refresh, user: userData, isLoading: false });
  },

  logout: async () => {
    await deleteStoreKey("userToken");
    await deleteStoreKey("refreshToken");
    set({ token: null, refresh: null, user: null, isLoading: false });
  },

  initialize: async () => {
    try {
      const token = await getStoreKey("userToken");
      // 2. Seteamos el token (si existe) y SIEMPRE apagamos isLoading
      set({ token, isLoading: false });
    } catch (error) {
      console.error("Error cargando el token:", error);
      set({ isLoading: false });
    }
  },
}));

export const getStoreKey = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export const setStoreKey = async (key: string, value: any) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    SecureStore.setItemAsync(key, value);
  }
}

export const deleteStoreKey = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}