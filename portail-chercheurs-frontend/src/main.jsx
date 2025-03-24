import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import du router pour gerer la navigation
import App from "./App.jsx"; // Import du composant principal

// Création de la racine de l'application et encapsulation avec <BrowserRouter>
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* On encapsule <App /> avec <BrowserRouter> pour permettre l'utilisation des routes partout dans l'application. */}
    <App />
  </BrowserRouter>
);
