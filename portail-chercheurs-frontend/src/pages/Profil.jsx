import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilChercheur from "../components/ProfilChercheur";

const Profil = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/connexion");
    }
  }, [navigate]);
  const chercheursData = {
    id: 1,
    nom: "Dr. Mohamed Ali",
    departement: "Informatique",
    publications: 10,
  };
  return (
    <div className=" p-2 sm:p-4 md:pd-7 lg:pd-10 xl:p-12">
      <ProfilChercheur chercheur={chercheursData} pov="chercheur" />
    </div>
  );
};

export default Profil;
