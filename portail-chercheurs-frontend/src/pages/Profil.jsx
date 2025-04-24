import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilChercheur from "../components/ProfilChercheur";
import axios from "../axios";
const Profil = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Assurez-vous que les cookies sont envoyés avec la requête
    axios
      .get("/profile", {
        withCredentials: true, // Ceci permet d'envoyer les cookies HTTPOnly avec la requête
      })
      .then((response) => {
        // Traitement si la requête réussit
        console.log("Profil récupéré:", response.data);
      })
      .catch((error) => {
        // Si l'authentification échoue ou si le token est invalide, rediriger vers la page de connexion
        console.error("Erreur de récupération du profil:", error);
        navigate("/connexion");
      });
  }, [navigate]);
  return (
    <div className=" p-2 sm:p-4 md:pd-7 lg:pd-10 xl:p-12">
      <ProfilChercheur />
    </div>
  );
};

export default Profil;
