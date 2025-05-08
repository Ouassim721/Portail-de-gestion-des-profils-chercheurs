import React, { useState, useEffect, useContext } from "react";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
import { LanguageContext } from "../../contexts/LanguageContext";

function TopBar() {
  const { t } = useContext(LanguageContext);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSideMenu = () => {
    setShowSideMenu((prev) => !prev);
  };

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => setChercheur(res.data))
      .catch((err) => {
        console.error(t("profileLoadError"), err);
        setChercheur(null);
      })
      .finally(() => setLoading(false));
  }, [t]);

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
        <div className="text-xl font-semibold">
          {t("userNotFound")}
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-b border-gray-200 p-4">
        <button type="button" onClick={toggleSideMenu} className="text-gray-500 hover:text-gray-600 focus:outline-none">
          <FaBars size={20} />
        </button>

        <h1 className="text-xl font-semibold">
          {t("welcomeMessage", { name: `${chercheur.prenom} ${chercheur.nom}` })}
        </h1>

        <div className="flex items-center space-x-2">
          <ChercheurAvatar chercheur={chercheur} size="lg" className="w-10 h-10" />
          <div>
            <p className="text-md font-semibold">
              {chercheur.prenom} {chercheur.nom}
            </p>
            <p className="text-sm text-gray-500">
              {t("adminRole")}
            </p>
          </div>
        </div>
      </header>

      <SideMenu isVisible={showSideMenu} onClose={() => setShowSideMenu(false)} />
    </>
  );
}

export default TopBar;
