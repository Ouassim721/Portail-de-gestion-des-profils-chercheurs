import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaTachometerAlt,
  FaUser,
  FaUniversity,
  FaCalendarAlt,
  FaShieldAlt,
  FaCog,
  FaTimes,
} from "react-icons/fa";

const SideMenu = ({ isVisible, onClose }) => {
  const links = [
    {
      label: "Tableau de bord",
      icon: <FaTachometerAlt />,
      to: "/",
    },
    { label: "Chercheurs", icon: <FaUser />, to: "/AdminChercheurs" },
    { label: "Institutions", icon: <FaUniversity />, to: "/institutions" },
    { label: "Evénements", icon: <FaCalendarAlt />, to: "/adminactualite" },
    { label: "Sécurité", icon: <FaShieldAlt />, to: "/securite" },
    { label: "Paramètres", icon: <FaCog />, to: "/parametres" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-50`}
      style={{
        backgroundColor: 'var(--color-white)',
        borderRight: '1px solid var(--color-bg-secondary)',
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)'
      }}
    >
      <button
        onClick={onClose}
        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4"
      >
        <FaTimes size={20} />
      </button>
      
      <nav>
        <ul className="space-y-2">
          {links.map(({ label, icon, to }) => (
            <li key={label}>
              <NavLink
                to={`/dashboard${to}`}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-bg-secondary)] text-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`
                }
              >
                <span className="text-xl">{icon}</span>
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
