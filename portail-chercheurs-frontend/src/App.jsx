import "./index.css";
import { Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

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
import { AuthProvider } from "./contexts/AuthProvider";

// Administration
import AdminDashboard from "./pages/administration/AdminDashboard";
import AdminChercheurs from "./pages/administration/AdminChercheurs";
import CreationChercheur from "./pages/administration/CreationChercheur";

//Loader
import { useLoading } from "./contexts/useLoading";
import Loader from "./components/Loader";

function App() {
  const { isLoading, showLoader, hideLoader } = useLoading();

  useEffect(() => {
    showLoader();
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }, [showLoader, hideLoader]);
  return (
    <>
      {isLoading && <Loader />}

      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="chercheurs" element={<Chercheurs />} />
            <Route path="/profil-chercheur/:id" element={<ProfilChercheur />} />
            <Route path="/actualite" element={<Actualite />} />
            <Route path="/publications" element={<Publications />} />
            <Route
              path="/details-publication/:id"
              element={<DetailsPublication />}
            />

            <Route path="/profil" element={<Profil />} />
          </Route>

          <Route path="/dashboard/connexion" element={<Connexion />} />
          <Route
            path="/dashboard/adminconnexion"
            element={<AdminConnexion />}
          />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route
            path="/dashboard/adminchercheurs"
            element={<AdminChercheurs />}
          />
          <Route
            path="/dashboard/adminchercheurs/creationchercheur"
            element={<CreationChercheur />}
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
