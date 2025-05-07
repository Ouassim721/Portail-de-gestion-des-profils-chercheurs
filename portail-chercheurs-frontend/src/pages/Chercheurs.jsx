import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/ui/Loader";
import DropdownButton from "../components/ui/DropdownButton";
import TableGenerique from "../components/tables/TableGenerique";
import Pagination from "../components/ui/Pagination";
import ProfilChercheur from "../components/ProfilChercheur";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";
import "./Chercheurs.css";

function Chercheurs() {
  const [chercheurs, setChercheurs] = useState([]);
  const [chercheurSelectionne, setChercheurSelectionne] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "nom",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    departement: "",
    publications: null,
  });

  // Appel API avec gestion des erreurs améliorée
  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          ...(searchTerm && { search: searchTerm }),
          sort: sortConfig.key,
          direction: sortConfig.direction,
          ...(filters.departement && { departement: filters.departement }),
          ...(filters.publications !== null && {
            publications: filters.publications,
          }),
        };

        const response = await axios.get(
          `http://localhost:8000/api/chercheurs?page=${currentPage}`
        );

        if (response.data && response.data.data) {
          setChercheurs(response.data.data);
          setTotalPages(response.data.last_page);
          setError(null);
        } else {
          throw new Error("Format de réponse inattendu");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(
          err.response?.data?.message || err.message || "Erreur de chargement"
        );
        setChercheurs([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchChercheurs, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm, sortConfig, filters]);

  // Gestion du tri
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset à la première page lors d'un nouveau tri
  };

  // Gestion de la recherche avec debounce intégré
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Gestion des filtres
  const handleFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value === "all" ? null : value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ departement: null, publications: null });
    setSortConfig({ key: "nom", direction: "asc" });
    setCurrentPage(1);
  };

  // Formatage des données pour la table
  const formatDataForTable = (data) => {
    return data.map((chercheur) => ({
      id: chercheur.id,
      nom: `${chercheur.prenom || ""} ${chercheur.nom || ""}`.trim(),
      departement: chercheur.discipline || "Non spécifié",
      publications: chercheur.publications_count || 0,
      rawData: chercheur,
    }));
  };

  // Colonnes configurables
  const tableColumns = [
    {
      key: "nom",
      label: "Nom",
      sortable: true,
      render: (item) => item.nom || "Inconnu",
    },
    {
      key: "departement",
      label: "Département",
      sortable: true,
      render: (item) => item.departement,
    },
    {
      key: "publications",
      label: "Publications",
      sortable: true,
      render: (item) => item.publications,
      className: "text-center", // Pour aligner les nombres
    },
  ];

  return (
    <div className="chercheurs-container">
      {/* En-tête */}
      <div className="header-image">
        <img src={book} alt="Chercheurs" className="w-full h-48 object-cover" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de titre et filtres */}
        <div className="flex flex-col md:flex-row justify-between items-center lg:px-40 mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Chercheurs
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Barre de recherche */}
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-400 text-[var(--color-text-secondary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Menu déroulant des filtres */}
            <DropdownButton
              icon={faSliders}
              text="Filtrer"
              variant="neutral"
              options={[
                {
                  label: "Par département",
                  children: [
                    {
                      label: "Tous",
                      value: "all",
                      onClick: () => handleFilter("departement", "all"),
                    },
                    {
                      label: "Informatique",
                      value: "Informatique",
                      onClick: () =>
                        handleFilter("departement", "Informatique"),
                    },
                    {
                      label: "Mathématiques",
                      value: "Mathématiques",
                      onClick: () =>
                        handleFilter("departement", "Mathématiques"),
                    },
                    {
                      label: "Physique",
                      value: "Physique",
                      onClick: () => handleFilter("departement", "Physique"),
                    },
                  ],
                },
                {
                  label: "Par publications",
                  children: [
                    {
                      label: "Tous",
                      value: "all",
                      onClick: () => handleFilter("publications", "all"),
                    },
                    {
                      label: "10+",
                      value: 10,
                      onClick: () => handleFilter("publications", 10),
                    },
                    {
                      label: "5+",
                      value: 5,
                      onClick: () => handleFilter("publications", 5),
                    },
                    {
                      label: "1+",
                      value: 1,
                      onClick: () => handleFilter("publications", 1),
                    },
                  ],
                },
                {
                  label: "Réinitialiser",
                  onClick: resetFilters,
                  variant: "danger",
                },
              ]}
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Contenu principal */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg shadow ">
              <TableGenerique
                columns={tableColumns}
                data={formatDataForTable(chercheurs)}
                onRowClick={(item) => setChercheurSelectionne(item.rawData)}
                onSort={handleSort}
                sortConfig={sortConfig}
                emptyMessage="Aucun chercheur trouvé"
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="justify-center"
                />
              </div>
            )}
          </>
        )}

        {/* Popup de détail */}
        {chercheurSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Profil du chercheur</h2>
                <button
                  onClick={() => setChercheurSelectionne(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>
              <div className="p-6">
                <ProfilChercheur
                  chercheur={chercheurSelectionne}
                  onClose={() => setChercheurSelectionne(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chercheurs;
