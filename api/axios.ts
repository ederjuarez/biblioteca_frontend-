import axios from "axios";
import { getStoreKey, setStoreKey, useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getStoreKey("userToken");
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
        const refreshToken = await getStoreKey("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const response = await axios.post(
          `${API_URL}/token/refresh/`,
          { refresh: refreshToken },
        );
        const { access } = response.data;
        console.log("Token refrescado con exito...");
        await setStoreKey("userToken", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        console.log("Se continua con la peticion original...");
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Error al refrescar token =>", refreshError);
        const { logout } = useAuthStore.getState(); // Obtenemos la función de logout directamente del store
        logout(); // Llamamos a logout para limpiar el estado de autenticación
        return
      }
    }
    return Promise.reject(error);
  },
);

export default api;
