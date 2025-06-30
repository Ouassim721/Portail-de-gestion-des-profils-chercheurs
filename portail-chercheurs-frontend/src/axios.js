import axios from "axios";
import { log } from "@/utils/logger";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log les requêtes
axiosInstance.interceptors.request.use((req) => {
  log(
    "→ Request:",
    req.method,
    req.url,
    "withCredentials=",
    req.withCredentials
  );
  return req;
});

// Gestion des erreurs globales
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
