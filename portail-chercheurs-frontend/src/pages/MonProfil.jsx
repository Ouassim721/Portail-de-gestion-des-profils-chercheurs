import React, { useEffect, useState } from "react";
import ProfilChercheur from "../components/ProfilChercheur";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";

function MonProfil() {
  const { id } = useParams();
  const [chercheurData, setChercheurData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChercheur = async () => {
      try {
        const response = await axios.get("/profile");

        setChercheurData(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du chercheur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChercheur();
  }, [id]);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>Erreur lors du chargement de ton profil</p>;
  return (
    <ProfilChercheur
      isPublic={false}
      chercheur={chercheurData}
      isOwner={true}
    />
  );
}

export default MonProfil;
