import React from "react";
import ProfilChercheur from "../components/ProfilChercheur";
const Profil = () => {
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
