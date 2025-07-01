import React, { useEffect, useState, useContext } from "react";
import ProfilChercheur from "../components/ProfilChercheur";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";
import { logError } from "@/utils/logger";

function MonProfil() {
  const { t } = useContext(LanguageContext);
  const [chercheurData, setChercheurData] = useState(null);
  const [publicationsData, setPublicationsData] = useState(null);
  const [statsRes, setStatsRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  // Nouvel état pour stocker les données du graphique
  const [publicationsByYear, setPublicationsByYear] = useState([]);

  const handleUpdate = (updatedData) => {
    setChercheurData(updatedData);
  };

  const toggleVisibility = async (publicationId) => {
    try {
      await axios.put(`/publications/${publicationId}/toggle-visibility`);
      refreshPublications();
    } catch (error) {
      logError("Erreur lors du changement de visibilité :", error);
    }
  };

  const refreshPublications = async () => {
    try {
      const publicationsRes = await axios.get("/profile/publications");
      setPublicationsData(publicationsRes.data.publications);
      // Calculer les publications par année lors du rafraîchissement
      calculatePublicationsByYear(publicationsRes.data.publications);
    } catch (error) {
      logError("Erreur lors du rafraîchissement des publications :", error);
    }
  };

  // Fonction pour calculer les publications par année
  const calculatePublicationsByYear = (publications) => {
    if (!publications || publications.length === 0) {
      setPublicationsByYear([]);
      return;
    }

    // Compter les publications par année
    const yearsMap = publications.reduce((acc, pub) => {
      if (pub.date_publication) {
        const year = new Date(pub.date_publication).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

    // Transformer en tableau d'objets et trier par année
    const yearsData = Object.entries(yearsMap)
      .map(([year, count]) => ({
        year: year.toString(),
        publications: count,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    setPublicationsByYear(yearsData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, publicationsRes, statsRes] = await Promise.all([
          axios.get("/me"),
          axios.get("/profile/publications"),
          axios.get("/chercheurs/me/stats"),
        ]);
        setChercheurData(profileRes.data);
        setPublicationsData(publicationsRes.data.publications);
        setStatsRes(statsRes.data);
        
        // Calculer les publications par année
        calculatePublicationsByYear(publicationsRes.data.publications);
      } catch (error) {
        logError("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCounter]);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>{t("profileLoadingError")}</p>;

  return (
    <ProfilChercheur
      isPublic={false}
      chercheur={chercheurData}
      publications={publicationsData || []}
      stats={statsRes}
      onUpdate={handleUpdate}
      isOwner={true}
      onToggleVisibility={toggleVisibility}
      refreshPublications={() => setRefreshCounter((prev) => prev + 1)}
      // Passer les données du graphique
      publicationsByYear={publicationsByYear}
    />
  );
}

export default MonProfil;