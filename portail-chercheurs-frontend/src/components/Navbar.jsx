import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import logo from "../assets/logo.png";
import pdp from "../assets/chercheur-place-holder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation(); // Récupérer l'URL actuelle

  // Mapping des chemins personnalisés
  const routesMap = {
    Accueil: "/",
    Chercheurs: "/chercheurs",
    Publications: "/publications",
    Actualité: "/Actualite",
    "À propos": "/about-us",
    Contact: "/contact",
  };

  return (
    <nav
      className={`relative w-full h-[80px] p-4 pr-8 flex items-center justify-between z-10 duration-300 ${
        isSticky
          ? "bg-[var(--color-white)] shadow-md sticky-top"
          : "bg-[var(--color-bg)]"
      } `}
    >
      {/* Logo et recherche */}
      <div className="flex items-center gap-12">
        <img src={logo} alt="Logo" className="w-[80px] h-[70px]" />

        {/* Barre de recherche - Visible sur grand écran */}
        <div className="hidden sm:flex relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-gray)]"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-[var(--color-white)] text-[var(--color-text-secondary)] p-3 pl-12 rounded-full w-64 lg-96 outline outline-gray-300 focus:outline-gray-500"
          />
        </div>
      </div>

      {/* Navigation - Desktop */}
      <ul className="hidden lg:flex items-center gap-6 text-lg text-[var(--color-gray)]">
        {[
          "Accueil",
          "Chercheurs",
          "Publications",
          "Actualité",
          "À propos",
          "Contact",
        ].map((item, index) => {
          const path =
            routesMap[item] || `/${item.toLowerCase().replace(" ", "-")}`;
          return (
            <li key={index}>
              <Link
                to={path}
                className={`hover:text-[var(--color-text-primary)] transition-colors duration-300 ${
                  location.pathname === path
                    ? "text-[var(--color-text-primary)]"
                    : ""
                }`}
              >
                {item}
              </Link>
            </li>
          );
        })}
        <DropdownMenu
          options={[
            {
              label: "profil",
              link: "/profil",
            },
          ]}
        >
          <img
            src={pdp}
            alt="Logo"
            className="w-16 rounded-full cursor-pointer"
          />
        </DropdownMenu>
      </ul>
      {/* Bouton Menu Burger - Mobile */}
      <button
        className="lg:hidden text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] z-10 cursor-pointer duration-300"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      {/* Menu Mobile */}
      <div
        className={`absolute top-0 left-0 w-full bg-[var(--color-bg)] p-6 flex flex-col gap-4 text-base text-[var(--color-gray)] shadow-md transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } lg:hidden`}
      >
        {[
          "Accueil",
          "Chercheurs",
          "Publications",
          "Actualité",
          "À propos",
          "Contact",
        ].map((item, index) => {
          const path =
            routesMap[item] || `/${item.toLowerCase().replace(" ", "-")}`;
          return (
            <Link
              key={index}
              to={path}
              className={`hover:text-[var(--color-text-primary)] transition-colors duration-300 ${
                location.pathname === path
                  ? "text-[var(--color-text-primary)]"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          );
        })}

        {/* Barre de recherche - Visible dans le menu mobile */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-gray)] text-lg"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-[var(--color-white)] text-[var(--color-text-secondary)] p-3 pl-12 rounded-full w-full outline-none"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
