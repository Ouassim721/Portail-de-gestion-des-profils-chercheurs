import React from 'react';
import { FaBars } from 'react-icons/fa';
import pdp from "../assets/chercheur-place-holder.jpg";

function TopBar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
      {/* Section gauche : Logo + Bouton pour ouvrir/fermer le menu latéral */}
      <div className="flex items-center space-x-4">
        <button 
          type="button" 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaBars size={20} />
        </button>
        <span className="font-bold text-lg">
          Admin_logo
        </span>
      </div>

      {/* Section centrale : Titre ou message de bienvenue */}
      <h1 className="text-xl font-semibold">
        Bienvenue Badreddine benhila
      </h1>

      {/* Section droite : Avatar + Infos utilisateur */}
      <div className="flex items-center space-x-2">
        <img
          src={pdp}
          alt="Logo"
          className="w-16 rounded-full cursor-pointer"
        />
        <div>
          <p className="text-sm font-medium">Badreddine benhila</p>
          <p className="text-xs text-gray-500">Administrateur</p>
        </div>
      </div>
    </header>
  );
}

export default TopBar;