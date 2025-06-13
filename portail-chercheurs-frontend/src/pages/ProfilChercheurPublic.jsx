import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import ProfilChercheur from "../components/ProfilChercheur";

function ProfilChercheurPublic() {
  const { id } = useParams();
  const [chercheurData, setChercheurData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicationsData, setPublicationsData] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingPublications(true);

        // Récupération des données du chercheur
        const chercheurResponse = await axios.get(`/chercheurs/${id}`);
        setChercheurData(chercheurResponse.data);

        // Récupération des publications du chercheur avec les disciplines
        const publicationsResponse = await axios.get(
          `/publications?chercheur_id=${id}`
        );
        setPublicationsData(publicationsResponse.data.data || []);

        // Récupération des disciplines pour le filtre
        const disciplinesResponse = await axios.get("/disciplines");
        setDisciplines(disciplinesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
        setLoadingPublications(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>Erreur lors du chargement du profil public</p>;

  return (
    <ProfilChercheur
      isPublic={true}
      chercheur={chercheurData}
      publications={publicationsData}
      disciplines={disciplines}
      loadingPublications={loadingPublications}
    />
  );
}

export default ProfilChercheurPublic;