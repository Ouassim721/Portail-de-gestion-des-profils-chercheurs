import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";
import axios from "../../axios";
import SearchBar from "../research/SearchBar";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSignOutAlt,
  faCog,
  faBars,
  faTimes,
  faQuestionCircle,
  faUser,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faRegularBell } from "@fortawesome/free-regular-svg-icons";
import SettingsModal from "../modals/SettingsModal";

function Navbar({ sticky = false }) {
  const { language, switchLanguage, t } = useContext(LanguageContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const routesMap = {
    [t("home")]: "/",
    [t("researchers")]: "/chercheurs",
    [t("publications")]: "/publications",
    [t("news")]: "/actualites",
    [t("about")]: "/about",
    [t("contact")]: "/contact",
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      try {
        const res = await axios.get("/profile", {
          withCredentials: true,
          signal: abortController.signal,
        });
        setChercheur(res.data);
      } catch {
        if (!abortController.signal.aborted) {
          setChercheur(null);
        }
      }
    };

    fetchUser();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setChercheur(null);
      navigate("/connexion");
    } catch (err) {
      console.error(t("logoutError"), err);
    }
  };

  return (
    <nav
      key={language}
      className={`w-full h-[74px] p-4 pr-8 flex items-center justify-between bg-[var(--color-bg-primary)]
        ${isSticky && sticky ? "sticky-top" : ""}
        navbar-transition`}
    >
      <div className="hidden lg:flex items-center gap-8">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          ScholarHub
        </Link>
        <div className="hidden xl:block">
          <SearchBar placeholder={t("searchPublications")} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ul
          className="hidden lg:flex gap-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {Object.entries(routesMap).map(([label, path]) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:text-[var(--color-primary)] transition-colors duration-300 ${
                  location.pathname === path
                    ? "text-[var(--color-primary)] font-medium"
                    : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button style={{ color: "var(--color-text-secondary)" }}>
          <FontAwesomeIcon icon={faRegularBell} className="text-xl" />
        </button>

        {chercheur ? (
          <DropdownMenu
            userProfile={chercheur}
            sections={[
              {
                options: [
                  {
                    label: t("myAccount"),
                    icon: faUser,
                    link: "/profil",
                  },
                  ...(chercheur.role === "Administrateur"
                    ? [
                        {
                          label: t("dashboard"),
                          icon: faTableColumns,
                          link: "/dashboard",
                        },
                      ]
                    : []),
                ],
              },
              {
                options: [
                  {
                    label: t("settings"),
                    icon: faCog,
                    onClick: () => setShowSettingsModal(true),
                  },
                  {
                    label: t("help"),
                    icon: faQuestionCircle,
                    link: "/aide",
                  },
                ],
              },
              {
                options: [
                  {
                    label: t("logout"),
                    icon: faSignOutAlt,
                    onClick: handleLogout,
                  },
                ],
              },
            ]}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <ChercheurAvatar chercheur={chercheur} size="md" />
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ color: "var(--color-gray)" }}
              />
            </div>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            onClick={() => navigate("/connexion")}
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-white)",
            }}
          >
            {t("login")}
          </Button>
        )}
      </div>

      <div className="lg:hidden flex items-center gap-4">
        <Link
          to="/"
          className="text-xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          ScholarHub
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "var(--color-text-secondary)" }}
          className="text-2xl hover:text-[var(--color-primary)]"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
      </div>

      {menuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 w-full p-4 shadow-lg"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text-primary)",
          }}
        >
          <div className="flex flex-col gap-4">
            {Object.entries(routesMap).map(([label, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`p-2 hover:bg-[var(--color-bg-secondary)] rounded ${
                  location.pathname === path
                    ? "text-[var(--color-primary)] font-medium"
                    : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4">
              <SearchBar placeholder={t("searchPublications")} />
            </div>
          </div>
        </div>
      )}

      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onLanguageChange={switchLanguage}
      />
    </nav>
  );
}

export default Navbar;
