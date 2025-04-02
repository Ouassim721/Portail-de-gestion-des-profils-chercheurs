import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import SideMenu from './SideMenu';
import pdp from "../assets/chercheur-place-holder.jpg";

function TopBar() {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const toggleSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };

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
        <h1 className="text-xl font-semibold">Bienvenue Badreddine benhila</h1>
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

      {/* Affichage conditionnel du SideMenu */}
      <SideMenu isVisible={showSideMenu} onClose={() => setShowSideMenu(false)} />
    </>
  );
}

export default TopBar;