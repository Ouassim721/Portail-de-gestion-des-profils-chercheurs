import { useState, useEffect } from "react";
import axios from "axios";
import DropdownButton from "../components/ui/DropdownButton";
import TableGenerique from "../components/tables/TableGenerique";
import Pagination from "../components/ui/Pagination";
import ProfilChercheur from "../components/ProfilChercheur";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";
import "./Chercheurs.css";

function Chercheurs() {
  const [chercheurs, setChercheurs] = useState([]);
  const [chercheurSelectionne, setChercheurSelectionne] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appel API à chaque changement de page
  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/chercheurs?page=${currentPage}`
        );

        // La réponse doit être structurée comme suit :
        // {
        //   data: [...],     // liste des chercheurs
        //   current_page: 1,
        //   last_page: 5,
        //   total: 50
        // }
        setChercheurs(response.data.data);
        setTotalPages(response.data.last_page);
        setError(null);
      } catch (error) {
        console.error("Erreur API:", error);
        setError("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChercheurs();
  }, [currentPage]);

  // Formatage des données pour la table générique
  const formatDataForTable = (data) => {
    return data.map((chercheur) => ({
      id: chercheur.id,
      nom: `${chercheur.prenom} ${chercheur.nom}`,
      departement: chercheur.discipline,
      publications: chercheur.publications_count || 0,
      rawData: chercheur, // On conserve les données brutes pour afficher le profil complet
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openPopup = (ligne) => {
    setChercheurSelectionne(ligne.rawData);
  };

  const closePopup = () => {
    setChercheurSelectionne(null);
  };

  // Gérer le scroll du body en cas d'ouverture du popup
  useEffect(() => {
    document.body.style.overflow = chercheurSelectionne ? "hidden" : "auto";
  }, [chercheurSelectionne]);

  return (
    <div className="chercheurs-container">
      {/* Image d'en-tête */}
      <div>
        <img
          src={book}
          alt="Chercheurs"
          className="w-full h-100 object-cover"
        />
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
            Chercheurs
          </h1>
          <DropdownButton
            icon={faSliders}
            children="Filtrer"
            variant="neutral"
            options={[
              { label: "Nom", onClick: () => console.log("Filtrer par nom") },
              {
                label: "Département",
                onClick: () => console.log("Filtrer par département"),
              },
              {
                label: "Publications",
                onClick: () => console.log("Filtrer par publications"),
              },
            ]}
          />
        </div>
        <div className="mx-auto mt-8 mb-12 bg-gray-300 h-0.5 w-3/4"></div>

        {isLoading ? (
          <div className="text-center py-8">Chargement en cours...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="mx-auto my-5">
            <TableGenerique
              columns={[
                { key: "nom", label: "Nom" },
                { key: "departement", label: "Département" },
                { key: "publications", label: "Publications" },
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

        {chercheurSelectionne && (
          <div className="popup-overlay">
            <div className="popup-content w-[95%] h-[95%] sm:w-[85%] md:w-[80%]">
              <button className="close-btn" onClick={closePopup}>
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
    </div>
  );
}

export default Chercheurs;
