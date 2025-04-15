// src/contexts/useLoading.js
import { useContext } from "react";
import { LoadingContext } from "./LoadingContext";

// Hook personnalisé pour accéder facilement au contexte
export function useLoading() {
  return useContext(LoadingContext);
}
