import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import pdp from "../../assets/chercheur-place-holder.jpg";
import axios from "../../axios";

function TopBar() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  const toggleSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Affichage conditionnel basé sur l'état de l'utilisateur et du chargement
  if (loading) {
    return (
      <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="text-xl font-semibold">Chargement...</div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="text-xl font-semibold">
          Utilisateur non trouvé ou non connecté
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleSideMenu}
          >
            <FaBars size={20} />
          </button>
        </div>
        <h1 className="text-xl font-semibold">
          Bienvenue {user.prenom} {user.nom}
        </h1>
        <div className="flex items-center space-x-2">
          <img
            src={pdp}
            alt="Logo"
            className="w-16 rounded-full cursor-pointer"
          />
          <div>
            <p className="text-sm font-medium">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-gray-500">Administrateur</p>
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
