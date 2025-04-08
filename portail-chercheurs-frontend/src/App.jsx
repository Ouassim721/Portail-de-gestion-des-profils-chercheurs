import "./index.css"; import { Routes, Route } from "react-router-dom";

// Pages publiques
import Home from "./pages/Home";
import Chercheurs from "./pages/Chercheurs";
import Actualite from "./pages/Actualite";
import Profil from "./pages/Profil";
import ProfilChercheur from "./components/ProfilChercheur";
import Layout from "./components/Layout";
import Publications from "./pages/Publications";
import DetailsPublication from "./pages/DetailsPublication";

// Authentification
import Connexion from "./pages/connexion";
import AdminConnexion from "./pages/administration/AdminConnexion";

// Administration
import AdminPage from "./pages/administration/tableau_de_bord";
import AdminChercheurs from "./pages/administration/AdminChercheurs";
import CreationChercheur from "./pages/administration/CreationChercheur";

function App() {
  return (
    <>
      <Routes>        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chercheurs" element={<Chercheurs />} />
          <Route path="/profil-chercheur/:id" element={<ProfilChercheur />} />
          <Route path="/actualite" element={<Actualite />} />
          <Route path="/Publications" element={<Publications />} />
          <Route path="/details-publication/:id" element={<DetailsPublication />} />

          
          <Route path="/profil" element={<Profil />} />
        </Route>

        <Route path="/connexion" element={<Connexion />} />
        <Route path="/adminconnexion" element={<AdminConnexion />} />
        <Route path="/tableau_de_bord" element={<AdminPage />} />
        <Route path="/AdminChercheurs" element={<AdminChercheurs />} />
        <Route path="/CreationChercheur" element={<CreationChercheur />} />

      </Routes>
    </>
  );
}

export default App;