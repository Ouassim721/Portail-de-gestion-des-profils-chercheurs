import React, { useState, useContext } from "react";
import CardProfilPublication from "./cards/CardProfilPublication";
import { LanguageContext } from "../contexts/LanguageContext";

const PublicationsSection = ({
  publications,
  onToggleView,
  isExpanded,
  className,
}) => {
  const { t } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Trier et filtrer les publications
  const filteredPublications = [...publications]
    .sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication))
    .filter((pub) => {
      const matchesSearch = pub.titre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "mostCited" ? pub.citation_count > 10 : true;
      return matchesSearch && matchesFilter;
    });

  // Nombre de publications à afficher
  const publicationsToShow = isExpanded
    ? filteredPublications
    : filteredPublications.slice(0, 5);

  const filterOptions = [
    { key: "all", label: t("pubFilterAll") },
    { key: "recent", label: t("pubFilterRecent") },
    { key: "mostCited", label: t("pubFilterMostCited") },
  ];

  return (
    <section
      className={`p-4 md:p-6 rounded-2xl shadow-sm bg-[var(--color-white)] ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {t("publicationsTitle")} {isExpanded ? "" : t("publicationsRecent")}
        </h1>

        {!isExpanded && publications.length > 5 && (
          <button
            onClick={onToggleView}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            {t("viewAll", { count: publications.length })}
          </button>
        )}
        {isExpanded && (
          <button
            onClick={onToggleView}
            className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
          >
            {t("viewLess")}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={t("pubSearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-gray)",
            }}
          />
          <div className="flex gap-2">
            {filterOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm rounded ${
                  filter === key
                    ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                    : "bg-[var(--color-bg-secondary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Affichage des cartes */}
      <div className="space-y-4">
        {publicationsToShow.map((pub) => (
          <CardProfilPublication key={pub.id} publication={pub} />
        ))}
      </div>

      {/* Si réduit et pas assez de publications */}
      {!isExpanded && publications.length <= 5 && (
        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          {t("noMorePublications")}
        </p>
      )}
    </section>
  );
};

export default PublicationsSection;
