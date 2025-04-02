import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUser,
  FaUniversity,
  FaCalendarAlt,
  FaShieldAlt,
  FaCog,
  FaTimes, // Import de l'icône pour fermer
} from 'react-icons/fa';

function Sidebar({ isVisible, onClose }) {
  const links = [
    { label: 'Tableau de bord', icon: <FaTachometerAlt />, to: '/tableau_de_bord' },
    { label: 'Chercheurs', icon: <FaUser />, to: '/AdminChercheurs' },
    { label: 'Institutions', icon: <FaUniversity />, to: '/institutions' },
    { label: 'Evénements', icon: <FaCalendarAlt />, to: '/evenements' },
    { label: 'Sécurité', icon: <FaShieldAlt />, to: '/securite' },
    { label: 'Paramètres', icon: <FaCog />, to: '/parametres' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4 shadow-lg transform ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      {/* Bouton de fermeture avec une icône */}
      <button
        className="text-gray-500 hover:text-gray-700 focus:outline-none mb-4"
        onClick={onClose}
      >
        <FaTimes size={20} />
      </button>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label} className="rounded-md">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md ${
                  isActive ? 'bg-gray-100 font-bold' : ''
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;