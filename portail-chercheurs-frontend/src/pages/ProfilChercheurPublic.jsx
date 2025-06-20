import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Correction cruciale ici
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
  const [disciplinesLoaded, setDisciplinesLoaded] = useState(false); // Nouvel état

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

        // Chargement unique des disciplines
        if (!disciplinesLoaded) {
          const disciplinesResponse = await axios.get("/disciplines");
          setDisciplines(disciplinesResponse.data);
          setDisciplinesLoaded(true);
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
        setLoadingPublications(false);
      }
    };

    fetchData();
  }, [id]); // Dépendances

  if (loading) return <Loader />;
  if (!chercheurData) return <p>Profil non trouvé</p>;

  return (
    <ProfilChercheur
    key={chercheurData.id}
      isPublic={true}
      chercheur={chercheurData}
      publications={publicationsData}
      disciplines={disciplines}
      loadingPublications={loadingPublications}
    />
  );
}

export default ProfilChercheurPublic;