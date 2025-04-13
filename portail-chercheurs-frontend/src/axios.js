import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Ton API Laravel
  withCredentials: true,
});

// Ajouter un intercepteur pour inclure le token JWT dans les en-têtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
