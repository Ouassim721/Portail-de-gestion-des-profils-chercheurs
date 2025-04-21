import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LoadingProvider } from "./contexts/LoadingProvider"; // Importer le LoadingProvider

// Création de la racine de l'application et encapsulation avec <BrowserRouter> et <LoadingProvider>
ReactDOM.createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <App />
  </LoadingProvider>
);
