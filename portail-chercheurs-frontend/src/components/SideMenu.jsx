import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FaTachometerAlt,
  FaUser,
  FaUniversity,
  FaCalendarAlt,
  FaShieldAlt,
  FaCog,
  FaTimes,
} from 'react-icons/fa';

const SideMenu = ({ isVisible, onClose }) => {
  const links = [
    { label: 'Tableau de bord', icon: <FaTachometerAlt />, to: '/tableau_de_bord' },
    { label: 'Chercheurs', icon: <FaUser />, to: '/AdminChercheurs' },
    { label: 'Institutions', icon: <FaUniversity />, to: '/institutions' },
    { label: 'Evénements', icon: <FaCalendarAlt />, to: '/evenements' },
    { label: 'Sécurité', icon: <FaShieldAlt />, to: '/securite' },
    { label: 'Paramètres', icon: <FaCog />, to: '/parametres' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4 shadow-lg transform ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
      aria-label="Navigation latérale"
    >
      <button
        onClick={onClose}
        aria-label="Fermer le menu"
        className="text-gray-500 hover:text-gray-700 focus:outline-none mb-4"
      >
        <FaTimes size={20} />
      </button>
      <nav>
        <ul className="space-y-2">
          {links.map(({ label, icon, to }) => (
            <li key={label} className="rounded-md">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    isActive ? 'bg-gray-100 font-bold' : ''
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

SideMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideMenu;