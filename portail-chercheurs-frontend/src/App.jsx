import "./index.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AuthProvider from "./contexts/AuthProvider";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MotDePasseOublie from "./pages/auth/MotDePasseOublie";
import ResetPassword from "./pages/auth/ResetPassword";
// Pages publiques
import Home from "./pages/Home";
import Chercheurs from "./pages/Chercheurs";
import Actualites from "./pages/Actualites";
import DetailsActualite from "./pages/DetailsActualite";
import ProfilChercheurPublic from "./pages/ProfilChercheurPublic";
import Publications from "./pages/Publications";
import DetailsPublication from "./pages/DetailsPublication";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";

// Authentification
import Connexion from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";
import ProfilUpdateForm from "./pages/auth/ProfilUpdateForm";
import SelectionPublication from "./pages/auth/SelectionPublications";

// Pages protégées
import MonProfil from "./pages/MonProfil";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminChercheurs from "./pages/admin/AdminChercheurs";
import CreationChercheur from "./pages/admin/CreationChercheur";
import AdminActualite from "./pages/admin/AdminActualites";
import CreationActualite from "./pages/admin/CreationActualite";
import ResearcherStats from "./pages/ResearcherStats";
import Contact from "./pages/Contact";
import CoursesPage from "./pages/CoursesPage";
import SubjectsPage from "./pages/SubjectsPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseForm from "./components/cours/CourseForm";
import AllCoursesPage from "./pages/AllCoursesPage";

function App() {
  return (
    <LanguageProvider>
      {" "}
      {/* Contexte de langue ajouté */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="chercheurs" element={<Chercheurs />} />
              <Route
                path="/chercheurs/:id"
                element={<ProfilChercheurPublic />}
              />

              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:id" element={<DetailsActualite />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/chercheurs-stats" element={<ResearcherStats />} />
              <Route path="/mes-cours" element={<CoursesPage />} />
              <Route path="/cours" element={<AllCoursesPage />} />
              <Route
                path="/chercheurs/:id/cours/new"
                element={<CourseForm />}
              />
              <Route
                path="/chercheurs/:id/cours/:coursId/edit"
                element={<CourseForm />}
              />
              <Route
                path="/DetailleCours/:coursId"
                element={<CourseDetailPage />}
              />

              {/* Matières */}
              <Route path="/mes-matieres" element={<SubjectsPage />} />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/details-publication/:id"
                element={<DetailsPublication />}
              />

              {/* Page Profil protégée */}
              <Route
                path="/mon-profil"
                element={
                  <ProtectedRoute redirectTo="/connexion">
                    <MonProfil />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Authentification */}
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profil-update-form" element={<ProfilUpdateForm />} />
            <Route
              path="/selection-publications"
              element={<SelectionPublication />}
            />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* Pages Admin protégées */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute redirectTo="/connexion" adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/adminchercheurs"
              element={
                <ProtectedRoute redirectTo="/connexion" adminOnly>
                  <AdminChercheurs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/adminactualite"
              element={
                <ProtectedRoute redirectTo="/connexion" adminOnly>
                  <AdminActualite />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/adminchercheurs/creationchercheur"
              element={
                <ProtectedRoute redirectTo="/connexion" adminOnly>
                  <CreationChercheur />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/adminactualite/creationactualite"
              element={
                <ProtectedRoute redirectTo="/connexion" adminOnly>
                  <CreationActualite />
                </ProtectedRoute>
              }
            />
            <Route path="/chercheurs/:id/cours/new" element={<CourseForm />} />
            <Route
              path="/chercheurs/:id/cours/:coursId/edit"
              element={<CourseForm />}
            />
            <Route
              path="/DetailleCours/:coursId"
              element={<CourseDetailPage />}
            />

            {/* Matières */}
            <Route path="/mes-matieres" element={<SubjectsPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
