import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import ProfilChercheur from "../components/ProfilChercheur";

function ProfilChercheurPublic() {
  const { id } = useParams();
  const [chercheurData, setChercheurData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicationsData, setPublicationsData] = useState(null);
  const [loadingPublications, setLoadingPublications] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingPublications(true);

        // Récupération des données du chercheur
        const chercheurResponse = await axios.get(`/chercheurs/${id}`);
        setChercheurData(chercheurResponse.data);

        // Récupération des publications du chercheur
        const publicationsResponse = await axios.get(
          `/chercheurs/${id}/publications`
        );
        setPublicationsData(publicationsResponse.data);
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
      publications={publicationsData || []}
      loadingPublications={loadingPublications}
    />
  );
}

export default ProfilChercheurPublic;
