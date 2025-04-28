import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";
import axios from "../../axios";
import SearchBar from "../research/SearchBar";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faGear,
  faUserCircle,
  faAngleDown,
  faSignOutAlt,
  faCog,
  faBars,
  faTimes,
  faCaretDown,
  faQuestionCircle,
  faShoppingBag,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faRegularBell } from "@fortawesome/free-regular-svg-icons"; // Style Regular

function Navbar({ sticky = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [chercheur, setChercheur] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/profile", {
          withCredentials: true,
        });
        setChercheur(res.data);
      } catch {
        setChercheur(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout"); // route backend qui supprime le token côté serveur
      setChercheur(null);
      window.location.href = "/connexion"; // ou navigation via React Router
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

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
    Actualités: "/actualites",
    "À propos": "/about-us",
    Contact: "/contact",
  };

  return (
    <nav
      className={`relative w-full h-[74px] p-4 pr-8 flex flex-row-reverse
 lg:flex-row items-center justify-between z-5 duration-300${
   isSticky && sticky == true
     ? "bg-[var(--color-white)] shadow-md sticky-top"
     : "bg-[var(--color-white)] shadow-sm "
 } `}
    >
      {/* Logo et recherche */}
      <div className="hidden lg:flex items-center gap-4 sm:gap-8 md:gap-12 lg-gap-16">
        {/* <img src={logo} alt="Logo" className="w-[80px] h-[70px]" /> */}
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">
          ScholarHub
        </h1>

        {/* Barre de recherche - Visible sur grand écran */}
        <div className="hidden xl:flex">
          <SearchBar />
        </div>
      </div>

      {/* Navigation - Desktop */}
      <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 text-md text-[var(--color-gray)]">
          {[
            "Accueil",
            "Chercheurs",
            "Publications",
            "Actualités",
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
        </ul>
        <div>
          <FontAwesomeIcon
            icon={faRegularBell}
            className="text-xl text-gray-700 cursor-pointer "
          />
        </div>
        {chercheur ? (
          // <DropdownMenu
          //   options={[
          //     {
          //       label: "Profil",
          //       link: "/profil",
          //       icon: faUser,
          //     },
          //     {
          //       label: "Paramètre",
          //       link: "/profil",
          //       icon: faGear,
          //     },
          //     {
          //       label: "Déconnexion",
          //       link: "/",
          //       onClick: handleLogout,
          //       icon: faRightFromBracket,
          //     },
          //   ]}
          // >
          //   <div className="flex gap-3 items-center">
          //     <div className="flex-shrink-0">
          //       <ChercheurAvatar
          //         chercheur={chercheur}
          //         size="md"
          //         className="w-13 h-13 cursor-pointer text-lg!"
          //       />
          //     </div>
          //     <div className="text-gray-600 ">
          //       <h2>{chercheur.prenom}</h2>
          //       <h2 className="uppercase">{chercheur.nom}</h2>
          //     </div>
          //     <FontAwesomeIcon
          //       icon={faCaretDown}
          //       className="text-xl text-gray-600"
          //     />
          //   </div>
          // </DropdownMenu>
          // <DropdownMenu
          //   sections={[
          //     {
          //       options: [
          //         { label: "Mon compte", icon: faUser, link: "/account" },
          //       ],
          //     },
          //     {
          //       options: [
          //         {
          //           label: "Paramètres",
          //           icon: faCog,
          //           onClick: () => console.log("Settings clicked"),
          //         },
          //         { label: "Aide", icon: faQuestionCircle, link: "/help" },
          //       ],
          //     },
          //     {
          //       options: [
          //         {
          //           label: "Déconnexion",
          //           icon: faSignOutAlt,
          //           onClick: handleLogout,
          //         },
          //       ],
          //     },
          //   ]}
          // >
          //   {/* Votre déclencheur de menu ici */}
          //   <div className="flex gap-3 items-center">
          //     <div className="flex-shrink-0">
          //       <ChercheurAvatar
          //         chercheur={chercheur}
          //         size="md"
          //         className="w-13 h-13 cursor-pointer text-lg!"
          //       />
          //     </div>
          //     <div className="text-gray-600 ">
          //       <h2>{chercheur.prenom}</h2>
          //       <h2 className="uppercase">{chercheur.nom}</h2>
          //     </div>
          //     <FontAwesomeIcon
          //       icon={faAngleDown}
          //       className="text-xl text-gray-600"
          //     />
          //   </div>
          // </DropdownMenu>
          <DropdownMenu
            userProfile={chercheur} // Ajoutez cette prop pour le profil en haut
            sections={[
              {
                options: [
                  { label: "Mon compte", icon: faUser, link: "/account" },
                ],
              },
              {
                options: [
                  {
                    label: "Paramètres",
                    icon: faCog,
                    onClick: () => console.log("Settings clicked"),
                  },
                  { label: "Aide", icon: faQuestionCircle, link: "/help" },
                ],
              },
              {
                options: [
                  {
                    label: "Déconnexion",
                    icon: faSignOutAlt,
                    onClick: handleLogout,
                  },
                ],
              },
            ]}
          >
            {/* Votre déclencheur de menu */}
            <div className="flex gap-3 items-center">
              <div className="flex-shrink-0">
                <ChercheurAvatar
                  chercheur={chercheur}
                  size="md"
                  className="w-12 h-12"
                />
              </div>
              <FontAwesomeIcon
                icon={faAngleDown}
                className="text-gray-500 ml-1 transition-transform duration-200"
              />
            </div>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/connexion")}
          >
            Connexion
          </Button>
        )}
      </div>
      <h1 className="lg:hidden text-xl sm:text-2xl font-bold text-[var(--color-primary)]">
        ScholarHub
      </h1>
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
          "Actualités",
          "À propos",
          "Contact",
        ].map((item, index) => {
          const path =
            routesMap[item] || `/${item.toLowerCase().replace(" ", "-")}`;
          return (
            <Link
              key={index}
              to={path}
              className={`hover:text-[var(--color-text-primary)] pl-10 sm:pl-0 transition-all duration-300 ${
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
