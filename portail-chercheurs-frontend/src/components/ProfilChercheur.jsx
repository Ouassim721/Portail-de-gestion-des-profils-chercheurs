import React, { useState, useContext } from "react";
import Button from "./ui/Button";
import FollowButton from "./ui/FollowButton";
import PublicationsSection from "./PublicationsSection";
import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import UpdateProfileModal from "./modals/UpdateProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChercheurAvatar from "./ui/ChercheurAvatar";
import {
  faBuildingColumns,
  faUserPen,
  faLocationDot,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LanguageContext } from "../contexts/LanguageContext";

function ProfilChercheur({
  chercheur,
  publications = [],
  isOwner = false,
  onUpdate,
  onToggleVisibility,
}) {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPublications, setShowAllPublications] = useState(false);
  const { isAuthenticated } = useAuth();

  const dataBar = [
    { year: "2019", publications: 5 },
    { year: "2020", publications: 8 },
    { year: "2021", publications: 12 },
    { year: "2022", publications: 10 },
    { year: "2023", publications: 15 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <section className="col-span-3 p-8 rounded shadow-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-gray-200">
        <div className="col-span-3 relative flex flex-col sm:flex-row gap-2 sm:gap-12 lg:gap-16">
          <div className="flex-shrink-0">
            <ChercheurAvatar
              chercheur={chercheur}
              size="xl"
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto sm:mx-0"
            />
          </div>
          <div className="sm:flex sm:justify-between w-full mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center sm:text-left">
                {chercheur.prenom} {chercheur.nom}
              </h2>
              <p className="text-sm mt-1 text-center sm:text-left text-[var(--color-text-secondary)]">
                {t("universityLabel")} {chercheur.university}
              </p>
              <div className="flex gap-4 justify-center my-3 sm:my-2">
                <Button
                  variant="secondary"
                  icon={faEnvelope}
                  className="text-sm p-2!"
                >
                  {t("contactButton")}
                </Button>
                {isAuthenticated &&
                  (isOwner ? (
                    <Button
                      variant="neutral"
                      icon={faUserPen}
                      className="text-sm p-2!"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {t("editButton")}
                    </Button>
                  ) : (
                    <FollowButton targetUserId={chercheur.id} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-full lg:col-span-1 p-8 shadow-sm bg-[var(--color-bg-primary)] border-gray-200">
        <h3 className="tracking-wide font-bold text-xl mb-4 text-[var(--color-text-primary)]">
          {t("infoTitle")}
        </h3>
        <ul className="flex flex-col gap-4 list-none text-[var(--color-text-primary)]">
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faBuildingColumns} />
            </span>
            {t("departmentLabel")} {chercheur.specialisation}
          </li>
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            {t("locationLabel")} Safi, Maroc
          </li>
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faGraduationCap} />
            </span>
            {t("degreeLabel")} PhD en Intelligence Artificielle
          </li>
        </ul>
      </section>

      <section className="col-span-full md:col lg:col-span-1 p-8 shadow-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-gray-200">
        <h3 className="tracking-wide font-bold text-xl mb-4">
          {t("statsTitle")}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h3>{t("statsPublications")}</h3>
            <h3 className="font-semibold text-lg">47</h3>
          </div>
          <div className="flex justify-between">
            <h3>{t("statsCitations")}</h3>
            <h3 className="font-semibold text-lg">1250</h3>
          </div>
          <div className="flex justify-between">
            <h3>{t("statsHIndex")}</h3>
            <h3 className="font-semibold text-lg">15</h3>
          </div>
          <div className="flex justify-between">
            <h3>{t("statsProjects")}</h3>
            <h3 className="font-semibold text-lg">12</h3>
          </div>
        </div>
      </section>

      <section className="col-span-full lg:col-span-1 p-8 shadow-sm bg-[var(--color-bg-primary)] border-gray-200">
        <h3 className="text-md font-medium tracking-wider text-center text-[var(--color-text-primary)]">
          {t("chartTitle")}
        </h3>
        <div className="h-40 md:h-50 max-w-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="publications" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <PublicationsSection
        publications={publications}
        onToggleView={() => setShowAllPublications(!showAllPublications)}
        isExpanded={showAllPublications}
        onToggleVisibility={onToggleVisibility}
      />

      {isOwner && (
        <UpdateProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          chercheur={chercheur}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

export default ProfilChercheur;
