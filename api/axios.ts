import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Token expirado, intentando refrescar...");
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          { refresh: refreshToken },
        );
        const { access } = response.data;
        await SecureStore.setItemAsync("userToken", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Error al refrescar token =>", refreshError);
        const {logout} = useAuthStore.getState(); // Obtenemos la función de logout directamente del store

        // await SecureStore.deleteItemAsync("userToken");
        // await SecureStore.deleteItemAsync("refreshToken");

        logout(); // Llamamos a logout para limpiar el estado de autenticación

        return
      }
    }
    return Promise.reject(error);
  },
);

export default api;
