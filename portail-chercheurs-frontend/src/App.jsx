import "./index.css";
import { Routes, Route } from "react-router-dom"; // Importation des outils de routage
import Home from "./pages/Home"; // Import de la page d'accueil
import Chercheurs from "./pages/Chercheurs"; // Import de la page des chercheurs
import Layout from "./components/Layout"; //importer le composant Layout
function App() {
  return (
    <>
      <Routes>
        {/* Définition des routes principales */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* Page d'accueil */}
          <Route path="chercheurs" element={<Chercheurs />} />{" "}
          {/* Page chercheurs */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
