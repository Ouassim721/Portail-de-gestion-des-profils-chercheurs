import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

// Pages publiques
import Home from "./pages/Home";
import Chercheurs from "./pages/Chercheurs";
import Actualite from "./pages/Actualite";
import ProfilChercheur from "./components/ProfilChercheur";
import Layout from "./components/Layout";
import Publications from "./pages/Publications";
import DetailsPublication from "./pages/DetailsPublication";
// import "./services/api";
import NotFound from "./pages/NotFound";

// Authentification
import Connexion from "./pages/connexion";
import ChangePassword from "./pages/ChangePassword";
import AdminConnexion from "./pages/administration/AdminConnexion";
import AuthProvider from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages protégées
import Profil from "./pages/Profil";
import AdminDashboard from "./pages/administration/AdminDashboard";
import AdminChercheurs from "./pages/administration/AdminChercheurs";
import CreationChercheur from "./pages/administration/CreationChercheur";

// Loader
import { useLoading } from "./contexts/useLoading";
import Loader from "./components/Loader";

import ProfileCompletion from "./pages/ProfileCompletion";
import ScopusPublications from "./pages/ScopusPublications";
import SelectScopusProfile from "./pages/SelectScopusProfile";

function App() {
  const { isLoading, showLoader, hideLoader } = useLoading();

  useEffect(() => {
    showLoader();
    setTimeout(() => {
      hideLoader();
    }, 300);
  }, [showLoader, hideLoader]);

  return (
    <>
      {/* {isLoading && <Loader />} */}

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="chercheurs" element={<Chercheurs />} />
              <Route
                path="/profil-chercheur/:id"
                element={<ProfilChercheur />}
              />
              <Route path="/actualite" element={<Actualite />} />
              <Route path="/publications" element={<Publications />} />
              <Route
                path="/details-publication/:id"
                element={<DetailsPublication />}
              />

              {/* Page Profil chercheur protégée */}
              <Route
                path="/profil"
                element={
                  <ProtectedRoute redirectTo="/connexion">
                    <Profil />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />

           {/* Authentification */}
           <Route path="/connexion" element={<Connexion />} />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute
                  redirectTo="/connexion"
                  allowIfMustChangePassword
                >
                  <ChangePassword />
                </ProtectedRoute>
              }
            /> 
            <Route path="complete-profile" element={<ProfileCompletion />} />
            <Route path="scopus-publications" element={<ScopusPublications />} />
            <Route path="/select-scopus-profile" element={<ScopusPublications />} />

            {/* Pages Admin protégées */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  redirectTo="/dashboard/adminconnexion"
                  adminOnly
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/adminchercheurs"
              element={
                <ProtectedRoute
                  redirectTo="/dashboard/adminconnexion"
                  adminOnly
                >
                  <AdminChercheurs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/adminchercheurs/creationchercheur"
              element={
                <ProtectedRoute
                  redirectTo="/dashboard/adminconnexion"
                  adminOnly
                >
                  <CreationChercheur />
                </ProtectedRoute>
              }
            />

            {/* Connexion admin */}
            <Route
              path="/dashboard/adminconnexion"
              element={<AdminConnexion />}
            />
          </Routes>
          
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
