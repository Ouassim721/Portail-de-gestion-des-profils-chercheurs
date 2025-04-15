import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/topbar";
import Dashboard from "../../components/Dashboard";
import axios from "../../axios";
function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification si le token est dans les cookies
    axios
      .get("/profile")
      .then((response) => {
        const user = response.data;
        if (user.role !== "admin") {
          navigate("/"); // Rediriger si l'utilisateur n'est pas un admin
        }
      })
      .catch((error) => {
        // Si l'utilisateur n'est pas authentifié ou autre erreur
        console.error("Erreur de récupération du profil:", error);
        navigate("/connexion"); // Rediriger vers la page de connexion si pas authentifié
      });
  }, [navigate]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
