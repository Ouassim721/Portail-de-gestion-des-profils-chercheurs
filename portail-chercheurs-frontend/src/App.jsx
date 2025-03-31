import "./index.css";
import { Routes, Route } from "react-router-dom"; // Importation des outils de routage
import Home from "./pages/Home";
import Chercheurs from "./pages/Chercheurs";
import Actualite from "./pages/Actualite";
import Profil from "./pages/Profil";
import Layout from "./components/Layout";
import ProfilChercheur from "./components/ProfilChercheur";

function App() {
  return (
    <>
      <Routes>
        {/* Définition des routes principales */}
        <Route path="/" element={<Layout />}>
          {/* Page d'accueil */}
          <Route index element={<Home />} />
          {/* Page chercheurs */}
          <Route path="chercheurs" element={<Chercheurs />} />{" "}
          {/* Page profil chercheurs */}
          <Route path="/profil-chercheur/:id" element={<ProfilChercheur />} />
          {/* Page D'actualités */}
          <Route path="/actualite" element={<Actualite />} />
          {/* Page De Profil Chercheur */}
          <Route path="/profil" element={<Profil />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
