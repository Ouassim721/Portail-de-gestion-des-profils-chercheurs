import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import ProfilChercheur from "../components/ProfilChercheur";

function ProfilChercheurPublic() {
  const { id } = useParams();
  const [chercheurData, setChercheurData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChercheur = async () => {
      try {
        const response = await axios.get(`/chercheurs/${id}`);

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
  if (!chercheurData) return <p>Erreur lors du chargement du profil public</p>;

  return <ProfilChercheur isPublic={true} chercheur={chercheurData} />;
}

export default ProfilChercheurPublic;
