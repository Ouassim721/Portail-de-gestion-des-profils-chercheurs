import { useState, useEffect, useContext } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";
import axios from "../../axios";
import SearchBar from "../research/SearchBar";
import NotificationModal from "../modals/NotificationModal";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSignOutAlt,
  faSignInAlt,
  faCog,
  faBars,
  faTimes,
  faQuestionCircle,
  faUser,
  faWindowRestore,
  faScrewdriverWrench,
  faChalkboardTeacher,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faRegularBell } from "@fortawesome/free-regular-svg-icons";
import SettingsModal from "../modals/SettingsModal";
import { logError } from "@/utils/logger";

function Navbar({ sticky = false }) {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { isAuthenticated } = useAuth();
  const { language, switchLanguage, t } = useContext(LanguageContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const routesMap = {
    [t("home")]: "/",
    [t("researchers")]: "/chercheurs",
    [t("publications")]: "/publications",
    [t("news")]: "/actualites",
    [t("courses")]: "/cours",
    [t("about")]: "/about",
  };

  if (isAuthenticated) {
    routesMap[t("contact")] = "/contact";
  }

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      if (!isAuthenticated) {
        setChercheur(null);
        return;
      }
      try {
        const res = await axios.get("/me", {
          withCredentials: true,
          signal: abortController.signal,
        });
        setChercheur(res.data);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setChercheur(null);
          logError(t("userFetchError"), err);
        }
      }
    };

    fetchUser();
    return () => abortController.abort();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("/notifications", { params: { unread: true } })
        .then((res) => setUnreadNotifications(res.data.total));
    }
  }, [isAuthenticated, location]);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setChercheur(null);
      navigate("/connexion");
    } catch (err) {
      logError(t("logoutError"), err);
    }
  };
  const handleLogin = () => {
    navigate("/connexion");
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
          <SearchBar placeholder={t("searchProfiles")} />
        </div>
      </div>
      <div className="lg:hidden flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "var(--color-text-secondary)" }}
          className="text-2xl hover:text-[var(--color-primary)]"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
        <Link to="/" className="text-xl font-bold text-[var(--color-primary)]">
          ScholarHub
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <ul className="hidden lg:flex gap-6 text-[var(--color-text-secondary)]">
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

        {isAuthenticated && (
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FontAwesomeIcon icon={faRegularBell} className="text-xl" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        )}
        {chercheur ? (
          <DropdownMenu
            userProfile={chercheur}
            sections={[
              {
                options: [
                  {
                    label: t("myAccount"),
                    icon: faUser,
                    link: "/mon-profil",
                  },
                  {
                    label: t("mySubjects"),
                    icon: faBook,
                    link: "/mes-matieres",
                  },
                  {
                    label: t("myCourses"),
                    icon: faChalkboardTeacher,
                    link: `/mes-cours`,
                  },
                  {
                    label: t("myDashboard"),
                    icon: faWindowRestore,
                    link: "/chercheurs-stats",
                  },
                  ...(chercheur.role === "Administrateur"
                    ? [
                        {
                          label: t("Admindashboard"),
                          icon: faScrewdriverWrench,
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
          <DropdownMenu
            sections={[
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
                    label: t("login"),
                    icon: faSignInAlt,
                    onClick: handleLogin,
                  },
                ],
              },
            ]}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ color: "var(--color-gray)" }}
              />
            </div>
          </DropdownMenu>
        )}
      </div>

      {menuOpen && (
        <div className="lg:hidden absolute top-[74px] left-0 w-full p-4 shadow-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] ">
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
      <NotificationModal
        show={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />
    </nav>
  );
}

export default Navbar;
