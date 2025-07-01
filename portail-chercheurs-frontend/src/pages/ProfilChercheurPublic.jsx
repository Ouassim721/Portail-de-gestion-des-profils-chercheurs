import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Correction cruciale ici
import axios from "../axios";
import Loader from "../components/ui/Loader";
import ProfilChercheur from "../components/ProfilChercheur";
import { logError } from "@/utils/logger";

function ProfilChercheurPublic() {
  const { id } = useParams();
  const [chercheurData, setChercheurData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicationsData, setPublicationsData] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [disciplines, setDisciplines] = useState([]);
  const [statsRes, setStatsRes] = useState(null);
  const [disciplinesLoaded, setDisciplinesLoaded] = useState(false); // Nouvel état
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [publicationsByYear, setPublicationsByYear] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingPublications(true);
        // Réinitialisation des données
        setChercheurData(null);
        setPublicationsData([]);
        setDisciplines([]);
        setDisciplinesLoaded(false);

        // Chargement du chercheur
        const chercheurResponse = await axios.get(`/chercheurs/${id}`);
        setChercheurData(chercheurResponse.data);

        // Chargement des publications
        const publicationsResponse = await axios.get(
          `/publications?chercheur_id=${id}&limit=all`
        );
        setPublicationsData(publicationsResponse.data.data || []);
        calculatePublicationsByYear(publicationsResponse.data.data);

        // Chargement unique des disciplines
        if (!disciplinesLoaded) {
          const disciplinesResponse = await axios.get("/disciplines");
          setDisciplines(disciplinesResponse.data);
          setDisciplinesLoaded(true);
        }
      } catch (error) {
        logError("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
        setLoadingPublications(false);
      }
    };

    fetchData();
  }, [id]); // Dépendances

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
        const [statsRes] = await Promise.all([
          axios.get(`/chercheurs/${id}/stats`),
        ]);
        setStatsRes(statsRes.data);
      } catch (error) {
        logError("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCounter]);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>Profil non trouvé</p>;

  return (
    <ProfilChercheur
      key={chercheurData.id}
      isPublic={true}
      chercheur={chercheurData}
      publications={publicationsData}
      disciplines={disciplines}
      stats={statsRes}
      loadingPublications={loadingPublications}
      refreshPublications={() => setRefreshCounter((prev) => prev + 1)}
      publicationsByYear={publicationsByYear}
    />
  );
}

export default ProfilChercheurPublic;
