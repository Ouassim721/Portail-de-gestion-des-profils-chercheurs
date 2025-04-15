import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoadingProvider } from "./contexts/LoadingProvider"; // Importer le LoadingProvider

// Création de la racine de l'application et encapsulation avec <BrowserRouter> et <LoadingProvider>
ReactDOM.createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoadingProvider>
);
