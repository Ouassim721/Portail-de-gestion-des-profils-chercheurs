import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/topbar";
import ChercheursDashboard from "../../components/ChercheursDashboard.jsx";
import CommentsDashboard from "../../components/CommentsDashboard.jsx";
import PublicationsDashboard from "../../components/PublicationsDashboard.jsx";
import DisciplineStatsPage from "../../components/DisciplineStatsPage.jsx";
import PedagogicalStatsPage from "../../components/PedagogicalStatsPage";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    axios
      .get("/me")
      .then((response) => {
        const user = response.data;
        if (user.role !== "Administrateur") {
          navigate("/");
        }
      })
      .catch((error) => {
        logError(t("profileError"), error);
        navigate("/connexion");
      });
  }, [navigate, t]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />
        
        {/* Barre de navigation horizontale en haut */}
        <nav className="bg-[var(--color-bg-primary)] sticky top-16 z-10 shadow-md">
          <div className="container mx-auto px-4">
            <ul className="flex space-x-1 overflow-x-auto py-3">
              <li>
                <a 
                  href="#chercheurs" 
                  className="whitespace-nowrap py-2 px-4 rounded hover:bg-[var(--color-bg-secondary)] transition text-sm md:text-base"
                >
                  {t("researchers")}
                </a>
              </li>
              <li>
                <a 
                  href="#publications" 
                  className="whitespace-nowrap py-2 px-4 rounded hover:bg-[var(--color-bg-secondary)] transition text-sm md:text-base"
                >
                  {t("publications")}
                </a>
              </li>
              <li>
                <a 
                  href="#commentaires" 
                  className="whitespace-nowrap py-2 px-4 rounded hover:bg-[var(--color-bg-secondary)] transition text-sm md:text-base"
                >
                  {t("comments")}
                </a>
              </li>
              <li>
                <a 
                  href="#disciplines" 
                  className="whitespace-nowrap py-2 px-4 rounded hover:bg-[var(--color-bg-secondary)] transition text-sm md:text-base"
                >
                  {t("disciplines")}
                </a>
              </li>
              <li>
                <a 
                  href="#pedagogie" 
                  className="whitespace-nowrap py-2 px-4 rounded hover:bg-[var(--color-bg-secondary)] transition text-sm md:text-base"
                >
                  {t("pedagogy")}
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <section id="chercheurs" className="mb-12 scroll-mt-24">
            <ChercheursDashboard />
          </section>
          
          <section id="publications" className="mb-12 scroll-mt-24">
            <PublicationsDashboard />
          </section>
          
          <section id="commentaires" className="mb-12 scroll-mt-24">
            <CommentsDashboard />
          </section>
          
          <section id="disciplines" className="mb-12 scroll-mt-24">
            <DisciplineStatsPage />
          </section>
          
          <section id="pedagogie" className="mb-12 scroll-mt-24">
            <PedagogicalStatsPage />
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;