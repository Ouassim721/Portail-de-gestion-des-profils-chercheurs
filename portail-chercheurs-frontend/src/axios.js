import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
axios.interceptors.request.use(req => {
  console.log('→ Request:', req.method, req.url, ' withCredentials=', req.withCredentials);
  return req;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
