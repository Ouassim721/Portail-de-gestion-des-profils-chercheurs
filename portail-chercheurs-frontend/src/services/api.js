import axios from "../axios";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirection vers login si non authentifié
      window.location = "/erreur";
    }
    return Promise.reject(error);
  }
);
