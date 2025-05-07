import React, { useState, useEffect, useContext } from "react";
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
import { LanguageContext } from "../contexts/LanguageContext";

function Chercheurs() {
  const { t } = useContext(LanguageContext);

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
        setChercheurs(response.data.data);
        setTotalPages(response.data.last_page);
        setError(null);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(t("errorLoadingData"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchChercheurs();
  }, [currentPage, t]);

  const formatDataForTable = (data) =>
    data.map((c) => ({
      id: c.id,
      nom: `${c.prenom} ${c.nom}`,
      departement: c.discipline,
      publications: c.publications_count || 0,
      rawData: c,
    }));

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const openPopup = (ligne) => setChercheurSelectionne(ligne.rawData);
  const closePopup = () => setChercheurSelectionne(null);

  useEffect(() => {
    document.body.style.overflow = chercheurSelectionne ? "hidden" : "auto";
  }, [chercheurSelectionne]);

  return (
    <div className="chercheurs-container">
      {/* En-tête */}
      <img
        src={book}
        alt={t("chercheursTitle")}
        className="w-full h-100 object-cover"
      />

      {/* Titre & Filtre */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
          {t("chercheursTitle")}
        </h1>
        <DropdownButton
          icon={faSliders}
          variant="neutral"
          children={t("filterButton")}
          options={[
            {
              label: t("filterByName"),
              onClick: () => console.log("Filtrer par nom"),
            },
            {
              label: t("filterByDepartment"),
              onClick: () => console.log("Filtrer par département"),
            },
            {
              label: t("filterByPublications"),
              onClick: () => console.log("Filtrer par publications"),
            },
          ]}
        />
      </div>
      <div className="mx-auto mt-8 mb-12 bg-gray-300 h-0.5 w-3/4"></div>

      {/* Contenu */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : chercheurs.length === 0 ? (
        <div className="text-center py-8">{t("noResults")}</div>
      ) : (
        <div className="mx-auto my-5">
          <TableGenerique
            className="bg-[var(--color-bg)]"
            columns={[
              { key: "nom", label: t("filterByName") },
              { key: "departement", label: t("filterByDepartment") },
              { key: "publications", label: t("filterByPublications") },
            ]}
            data={formatDataForTable(chercheurs)}
            onRowClick={openPopup}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Popup profil */}
      {chercheurSelectionne && (
        <div className="popup-overlay">
          <div className="popup-content bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <button
              aria-label={t("closeButtonAria")}
              className="close-btn"
              onClick={closePopup}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <ProfilChercheur
              chercheur={chercheurSelectionne}
              onClose={closePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chercheurs;
