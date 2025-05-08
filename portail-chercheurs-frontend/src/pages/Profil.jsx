import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilChercheur from "../components/ProfilChercheur";
import { LanguageContext } from "../contexts/LanguageContext";
import axios from "../axios";

const Profil = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios
      .get("/profile", { withCredentials: true })
      .then((response) => {
        if (isMounted) {
          setProfile(response.data);
        }
      })
      .catch((error) => {
        console.error("Erreur de récupération du profil :", error);
        navigate("/connexion");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return <div className="p-4 text-center">{t("loading")}</div>;
  }

  if (!profile) {
    // Si profile est null après chargement, on peut afficher un message ou rediriger
    return null;
  }

  return (
    <div className="p-2 sm:p-4 md:p-7 lg:p-10 xl:p-12">
      <ProfilChercheur me={true} />
    </div>
  );
};

export default Profil;
