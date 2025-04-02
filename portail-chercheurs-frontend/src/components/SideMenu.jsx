import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaUniversity,
  FaCalendarAlt,
  FaShieldAlt,
  FaCog,
} from 'react-icons/fa';

function Sidebar() {
  const links = [
    { label: 'Tableau de bord', icon: <FaTachometerAlt />, to: '/tableau_de_bord' },
    { label: 'Chercheurs', icon: <FaUser />, to: '/AdminChercheurs' },
    { label: 'Institutions', icon: <FaUniversity />, to: '/institutions' },
    { label: 'Evénements', icon: <FaCalendarAlt />, to: '/evenements' },
    { label: 'Sécurité', icon: <FaShieldAlt />, to: '/securite' },
    { label: 'Paramètres', icon: <FaCog />, to: '/parametres' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
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



