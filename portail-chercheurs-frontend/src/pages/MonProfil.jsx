import React, { useEffect, useState } from "react";
import ProfilChercheur from "../components/ProfilChercheur";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";

function MonProfil() {
  const [chercheurData, setChercheurData] = useState(null);
  const [publicationsData, setPublicationsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, publicationsRes] = await Promise.all([
          axios.get("/profile"),
          axios.get("/profile/publications"),
        ]);

        setChercheurData(profileRes.data);
        setPublicationsData(publicationsRes.data.publications);
        console.log("Données publications récupérées :", publicationsRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>Erreur lors du chargement de ton profil</p>;

  return (
    <ProfilChercheur
      isPublic={false}
      chercheur={chercheurData}
      publications={publicationsData || []}
      isOwner={true}
    />
  );
}

export default MonProfil;
