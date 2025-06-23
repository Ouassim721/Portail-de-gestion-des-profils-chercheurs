import { useState, useEffect, useContext } from "react";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import Pagination from "../components/ui/Pagination";
import ChercheursGrid from "../components/cards/ChercheursGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";
import { LanguageContext } from "../contexts/LanguageContext";

function Chercheurs() {
  const { t } = useContext(LanguageContext);
  const [chercheurs, setChercheurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/chercheurs`, {
          params: {
            page: currentPage,
            search: searchTerm,
            per_page: 12,
          },
        });

        setChercheurs(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (err) {
        setError(err.response?.data?.message || t("errorLoadingData"));
        setChercheurs([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchChercheurs, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm, t]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="chercheurs-container">
      <div
        className="w-full h-[30rem] relative px-8 py-16 bg-[var(--color-primary)] bg-cover bg-center"
        style={{ backgroundImage: `url(${book})` }}
      >
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black opacity-50 z-0" />

        {/* Contenu centré */}
        <div className="relative z-10 text-white text-center flex flex-col items-center justify-center h-full space-y-6">
          <h1 className="text-5xl font-bold">
            Explorez l'Excellence en Recherche
          </h1>
          <p className="text-xl max-w-2xl">
            Découvrez les profils des chercheurs, leurs spécialisations, leurs
            publications et leurs contributions à la science.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-[var(--color-primary)]">
            {t("researchers")}
          </h1>

          <div className="relative w-full md:w-64 lg:w-100">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchResearchersPlaceholder")}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full text-[var(--color-text-secondary)] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" text={t("loading")} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t("retry")}
            </button>
          </div>
        ) : (
          <>
            <ChercheursGrid chercheurs={chercheurs} />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Chercheurs;
