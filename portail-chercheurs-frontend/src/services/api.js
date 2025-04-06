import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getChercheurs = () => {
  return api.get("/chercheurs");
};

export const getChercheurById = (id) => {
  return api.get(`/chercheurs/${id}`);
};

export const createChercheur = (data) => {
  return api.post("/chercheurs", data);
};
