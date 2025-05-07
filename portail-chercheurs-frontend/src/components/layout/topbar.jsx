import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";

function TopBar() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  const toggleSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/profile");
        setChercheur(res.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
        setChercheur(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Affichage conditionnel basé sur l'état de l'utilisateur et du chargement
  if (loading) {
    return (
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] border-b border-gray-400 p-4">
        <Loader />
      </header>
    );
  }

  if (!chercheur) {
    return (
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-b border-gray-200 p-4">
        <div className="text-xl font-semibold">
          Utilisateur non trouvé ou non connecté
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={toggleSideMenu}
          >
            <FaBars size={20} />
          </button>
        </div>
        <h1 className="text-xl font-semibold">
          Bienvenue {chercheur.prenom} {chercheur.nom}
        </h1>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <ChercheurAvatar
              chercheur={chercheur}
              size="lg"
              className="w-10 h-10 text-lg!"
            />
          </div>
          <div>
            <p className="text-md font-semibold">
              {chercheur.prenom} {chercheur.nom}
            </p>
            <p className="text-sm text-gray-500">Administrateur</p>
          </div>
        </div>
      </header>

      {/* Affichage conditionnel du SideMenu */}
      <SideMenu
        isVisible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
      />
    </>
  );
}

export default TopBar;
