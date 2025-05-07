// src/components/ProfilChercheur.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "../axios";
import Loader from "./ui/Loader";
import Button from "./ui/Button";
import PublicationsSection from "./PublicationsSection";
import UpdateProfileModal from "./modals/UpdateProfileModal";
import ChercheurAvatar from "./ui/ChercheurAvatar";
import { LanguageContext } from "../contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faUserPen,
  faLocationDot,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

function ProfilChercheur() {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chercheur, setChercheur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publication, setPublication] = useState([]);
  const [showAllPublications, setShowAllPublications] = useState(false);

  // Charge profil et publications
  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: prof }, { data: pubs }] = await Promise.all([
          axios.get("/profile", { withCredentials: true }),
          axios.get("/profile/publications", { withCredentials: true }),
        ]);
        setChercheur(prof);
        setPublication(pubs.publications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader text={t("loading")} />;
  if (!chercheur) return <p>{t("profileLoadError")}</p>;

  // Données statiques d’exemple pour le bar chart
  const dataBar = [
    { year: "2019", publications: 5 },
    { year: "2020", publications: 8 },
    { year: "2021", publications: 12 },
    { year: "2022", publications: 10 },
    { year: "2023", publications: 15 },
  ];

  const handleUpdate = (updated) => setChercheur(updated);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {/* Header profil */}
      <section className="col-span-3 p-8 rounded-lg shadow-md bg-[var(--color-white)]">
        <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-12 lg:gap-16">
          <ChercheurAvatar
            chercheur={chercheur}
            size="xl"
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto sm:mx-0"
          />
          <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {chercheur.prenom} {chercheur.nom}
            </h2>
            <p className="text-sm mt-1 text-[var(--color-text-secondary)]">
              {t("universityLabel")} {chercheur.university}
            </p>
            <div className="flex gap-4 justify-center sm:justify-start my-3">
              <Button variant="secondary" icon={faEnvelope}>
                {t("contactButton")}
              </Button>
              <Button
                variant="neutral"
                icon={faUserPen}
                onClick={() => setIsModalOpen(true)}
              >
                {t("editButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Informations */}
      <section className="p-8 rounded-lg shadow-md bg-[var(--color-white)]">
        <h3 className="text-xl font-bold mb-4">{t("infoTitle")}</h3>
        <ul className="flex flex-col gap-4">
          <li>
            <FontAwesomeIcon icon={faBuildingColumns} className="mr-2" />
            {t("departmentLabel")} {chercheur.discipline}
          </li>
          <li>
            <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
            {t("locationLabel")}
          </li>
          <li>
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            {t("degreeLabel")}
          </li>
        </ul>
      </section>

      {/* Statistiques */}
      <section className="p-8 rounded-lg shadow-md bg-[var(--color-white)]">
        <h3 className="text-xl font-bold mb-4">{t("statsTitle")}</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{t("statsPublications")}</span>
            <strong>47</strong>
          </div>
          <div className="flex justify-between">
            <span>{t("statsCitations")}</span>
            <strong>1250</strong>
          </div>
          <div className="flex justify-between">
            <span>{t("statsHIndex")}</span>
            <strong>15</strong>
          </div>
          <div className="flex justify-between">
            <span>{t("statsProjects")}</span>
            <strong>12</strong>
          </div>
        </div>
      </section>

      {/* Graphique */}
      <section className="p-8 rounded-lg shadow-md bg-[var(--color-white)]">
        <h3 className="text-md font-medium text-center mb-2">
          {t("chartTitle")}
        </h3>
        <div className="h-40 max-w-[350px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <Bar dataKey="publications" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Publications */}
      <PublicationsSection
        publications={publication}
        onToggleView={() => setShowAllPublications(!showAllPublications)}
        isExpanded={showAllPublications}
        className="col-span-3"
      />

      {/* Modal de mise à jour */}
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chercheur={chercheur}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default ProfilChercheur;
