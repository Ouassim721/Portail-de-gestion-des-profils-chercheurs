import React, { useEffect, useState, useContext } from "react";
import ProfilChercheur from "../components/ProfilChercheur";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";

function MonProfil() {
  const { t } = useContext(LanguageContext);
  const [chercheurData, setChercheurData] = useState(null);
  const [publicationsData, setPublicationsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleVisibility = async (publicationId) => {
    try {
      await axios.put(`/publications/${publicationId}/toggle-visibility`);
      const publicationsRes = await axios.get("/profile/publications");
      setPublicationsData(publicationsRes.data.publications);
    } catch (error) {
      console.error("Erreur lors du changement de visibilité :", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, publicationsRes] = await Promise.all([
          axios.get("/me"),
          axios.get("/profile/publications"),
        ]);
        setChercheurData(profileRes.data);
        setPublicationsData(publicationsRes.data.publications);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (!chercheurData) return <p>{t("profileLoadingError")}</p>;

  return (
    <ProfilChercheur
      isPublic={false}
      chercheur={chercheurData}
      publications={publicationsData || []}
      isOwner={true}
      onToggleVisibility={toggleVisibility}
    />
  );
}

export default MonProfil;
