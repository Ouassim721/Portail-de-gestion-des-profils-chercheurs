import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/topbar";
import DashboardChercheur from "../../components/ChercheursDashboard.jsx";
import CommentsDashboard from "../../components/CommentsDashboard.jsx";
import DashboardPublication from "../../components/PublicationsDashboard.jsx";
import DisciplineStatsPage from "../../components/DisciplineStatsPage.jsx";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    axios
      .get("/me")
      .then((response) => {
        const user = response.data;
        if (user.role !== "Administrateur") {
          // Optionnel : afficher un message ou toast
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(t("profileError"), error);
        navigate("/connexion");
      });
  }, [navigate, t]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{t("dashboardTitle")}</h1>
          <DashboardChercheur />
          <DashboardPublication />
          <CommentsDashboard />
          <DisciplineStatsPage />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
