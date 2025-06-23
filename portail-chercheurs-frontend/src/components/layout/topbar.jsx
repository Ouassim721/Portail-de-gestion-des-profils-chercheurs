import React, { useState, useEffect, useContext } from "react";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../ui/DropdownMenu";
import NotificationModal from "../modals/NotificationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSignOutAlt,
  faCog,
  faQuestionCircle,
  faUser,
  faWindowRestore,
  faScrewdriverWrench,
  faChalkboardTeacher,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import SettingsModal from "../modals/SettingsModal";
import { logError } from "@/utils/logger";
function TopBar() {
  const { language, switchLanguage, t } = useContext(LanguageContext);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const toggleSideMenu = () => {
    setShowSideMenu((prev) => !prev);
  };

  useEffect(() => {
    axios
      .get("/me")
      .then((res) => setChercheur(res.data))
      .catch((err) => {
        console.error(t("profileLoadError"), err);
        setChercheur(null);
      })
      .finally(() => setLoading(false));
  }, [t]);
  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setChercheur(null);
      navigate("/connexion");
    } catch (err) {
      logError(t("logoutError"), err);
    }
  };
  if (loading) {
    return (
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] border-b border-gray-400 p-4">
        <Loader />
      </header>
    );
  }

  if (!chercheur) {
    return (
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-b border-gray-200 p-4">
        <div className="text-xl font-semibold">{t("userNotFound")}</div>
      </header>
    );
  }

  return (
    <>
      <header
        key={language}
        className="flex items-center justify-between bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-4"
      >
        <button
          type="button"
          onClick={toggleSideMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          <FaBars size={20} />
        </button>

        <h1 className="text-xl font-semibold">
          {t("welcomeMessage", {
            name: `${chercheur.prenom} ${chercheur.nom}`,
          })}
        </h1>

        <div className="flex items-center space-x-2">
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
              <ChercheurAvatar
                chercheur={chercheur}
                size="lg"
                className="w-10 h-10"
              />{" "}
              <div>
                <p className="text-md font-semibold">
                  {chercheur.prenom} {chercheur.nom}
                </p>
                <p className="text-sm text-gray-500">{t("adminRole")}</p>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ color: "var(--color-gray)" }}
            />
          </DropdownMenu>
        </div>
      </header>

      <SideMenu
        isVisible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
      />
      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onLanguageChange={switchLanguage}
      />
      <NotificationModal
        show={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />
    </>
  );
}

export default TopBar;
