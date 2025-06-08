import React, { useContext } from "react";
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
import { LanguageContext } from "../../contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const SideMenu = ({ isVisible, onClose }) => {
  const { t } = useContext(LanguageContext);

  const links = [
    { labelKey: "dashboardTitle", icon: <FaTachometerAlt />, to: "/" },
    {
      labelKey: "ResearchersTitle",
      icon: <FaUser />,
      to: "/AdminChercheurs",
    },
    { labelKey: "Discipline", icon: <FaUniversity />, to: "/admindisciplines" },
    {
      labelKey: "upcomingEventTitle",
      icon: <FaCalendarAlt />,
      to: "/adminactualite",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-bg-primary)] border-r border-gray-400 p-4 shadow-lg transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
      aria-label={t("sideMenuAriaLabel")}
    >
      <button
        onClick={onClose}
        aria-label={t("closeMenu")}
        className="text-gray-500 hover:text-gray-700 focus:outline-none mb-4"
      >
        <FaTimes size={20} />
      </button>
      <nav className="flex flex-col justify-between h-full">
        <ul className="space-y-2">
          {links.map(({ labelKey, icon, to }) => (
            <li key={labelKey} className="rounded-md">
              <NavLink
                to={`/dashboard${to}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-[var(--color-text-primary)] hover:bg-gray-300 hover:text-black rounded-md ${
                    isActive
                      ? "hover:bg-gray-300 hover:text-black font-bold"
                      : ""
                  }`
                }
              >
                {icon}
                <span>{t(labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 mb-10">
          <li className="rounded-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 text-[var(--color-text-primary)] hover:bg-gray-300 hover:text-black rounded-md ${
                  isActive ? "hover:bg-gray-300 hover:text-black font-bold" : ""
                }`
              }
            >
              <FontAwesomeIcon icon={faHouse} className="w-5 h-5" />
              <span>{t("Home")}</span>
            </NavLink>
          </li>
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
