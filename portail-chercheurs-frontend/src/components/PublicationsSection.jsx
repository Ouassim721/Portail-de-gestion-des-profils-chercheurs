import { useState } from "react";
import CardProfilPublication from "./cards/CardProfilPublication";

const PublicationsSection = ({
  publications,
  onToggleView,
  isExpanded,
  className,
}) => {
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

  return (
    <section
      className={`p-4 md:p-6 rounded-2xl shadow-sm bg-[var(--color-bg-primary)] col-span-3 lg:px-12 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Publications {isExpanded ? "" : "récentes"}
        </h1>

        {!isExpanded && publications.length > 5 && (
          <button
            onClick={onToggleView}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Voir toutes ({publications.length})
          </button>
        )}
        {isExpanded && (
          <button
            onClick={onToggleView}
            className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
          >
            Voir moins
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher par titre..."
            className="flex-1 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            {["Toutes", "Récentes", "Plus citées"].map((option) => (
              <button
                key={option}
                className={`px-3 py-1 text-sm rounded ${
                  filter === option.toLowerCase().replace(" ", "")
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setFilter(option.toLowerCase().replace(" ", ""))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {publicationsToShow.length > 0 ? (
          publicationsToShow.map((pub) => (
            <CardProfilPublication
              key={pub.identifiant}
              title={pub.titre}
              publicationDate={pub.date_publication}
              citationCount={pub.citation_count}
              abstract={pub.abstract}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">Aucune publication trouvée</p>
        )}
      </div>

      {isExpanded && (
        <button
          onClick={onToggleView}
          className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
        >
          Voir moins
        </button>
      )}
    </section>
  );
};

export default PublicationsSection;
