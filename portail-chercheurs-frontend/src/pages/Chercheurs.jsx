import { useState, useEffect } from "react";
//import { getChercheurs } from "../services/api"; // Importation de la fonction API
import "./Chercheurs.css";
import DropdownButton from "../components/DropdownButton";
import TableGenerique from "../components/TableGenerique";
import Pagination from "../components/Pagination";
import ProfilChercheur from "../components/ProfilChercheur";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";

function Chercheurs() {
  // Fake data en attendant l'API
  const fakeData = [
    {
      id: 1,
      nom: "Dr. Mohamed Ali",
      departement: "Informatique",
      publications: 10,
    },
    {
      id: 2,
      nom: "Dr. Sara Karim",
      departement: "Mathématiques",
      publications: 15,
    },
    {
      id: 3,
      nom: "Dr. Sara Hassan",
      departement: "SMI",
      publications: 15,
    },
    {
      id: 4,
      nom: "Dr. Ahmed Ben",
      departement: "SMI",
      publications: 12,
    },
    {
      id: 5,
      nom: "Dr. Fatima Zahra",
      departement: "Informatique",
      publications: 8,
    },
    {
      id: 6,
      nom: "Dr. Omar El",
      departement: "Mathématiques",
      publications: 20,
    },
    {
      id: 7,
      nom: "Dr. Amina Badr",
      departement: "Informatique",
      publications: 5,
    },
    {
      id: 8,
      nom: "Dr. Youssef Ali",
      departement: "SMI",
      publications: 18,
    },
    {
      id: 9,
      nom: "Dr. Leila Ahmed",
      departement: "Mathématiques",
      publications: 22,
    },
    {
      id: 10,
      nom: "Dr. Rachid Bou",
      departement: "Informatique",
      publications: 30,
    },
    {
      id: 11,
      nom: "Dr. Samira El",
      departement: "SMI",
      publications: 25,
    },
    {
      id: 12,
      nom: "Dr. Khaled Sa",
      departement: "Informatique",
      publications: 14,
    },
    {
      id: 13,
      nom: "Dr. Hicham Ou",
      departement: "Mathématiques",
      publications: 9,
    },
    {
      id: 14,
      nom: "Dr. Souad El",
      departement: "SMI",
      publications: 17,
    },
    {
      id: 15,
      nom: "Dr. Yassine Am",
      departement: "Informatique",
      publications: 11,
    },
    {
      id: 16,
      nom: "Dr. Nadia Ba",
      departement: "Mathématiques",
      publications: 13,
    },
    {
      id: 17,
      nom: "Dr. Walid El",
      departement: "SMI",
      publications: 19,
    },
    {
      id: 18,
      nom: "Dr. Amina Sa",
      departement: "Informatique",
      publications: 21,
    },
    {
      id: 19,
      nom: "Dr. Ibrahim Ou",
      departement: "Mathématiques",
      publications: 27,
    },
    {
      id: 20,
      nom: "Dr. Salma Am",
      departement: "SMI",
      publications: 16,
    },
    {
      id: 21,
      nom: "Dr. Omar El",
      departement: "Informatique",
      publications: 12,
    },
    {
      id: 22,
      nom: "Dr. Fatima Ba",
      departement: "Mathématiques",
      publications: 14,
    },
    {
      id: 23,
      nom: "Dr. Hicham Am",
      departement: "SMI",
      publications: 10,
    },
    {
      id: 24,
      nom: "Dr. Souad Ou",
      departement: "Informatique",
      publications: 8,
    },
    {
      id: 25,
      nom: "Dr. Yassine El",
      departement: "Mathématiques",
      publications: 9,
    },
  ];

  //*********************************************************************/
  // État pour stocker la liste des chercheurs récupérée de l'API ou des fake data
  const [chercheurs, setChercheurs] = useState([]);

  useEffect(() => {
    setChercheurs(fakeData);
    localStorage.setItem("chercheurs", JSON.stringify(fakeData));

    // Une fois l'API disponible il faut decommenter ce bloc
    /*
      getChercheurs() // Appel à la fonction qui récupère les données de l'API
        .then((response) => {
          setChercheurs(response.data); // Stocke les données dans l'état
          localStorage.setItem("chercheurs", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des chercheurs!", error); // En cas d'erreur
        });
      */
  }, []);

  // État pour gérer la page actuelle de pagination
  const [chercheurSelectionne, setChercheurSelectionne] = useState(null); // Chercheur sélectionné pour afficher dans le pop-up
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const chercheursPerPage = 10; // Nombre de chercheurs par page

  // Calcul des indices de la page actuelle pour la pagination
  const indexOfLastChercheur = currentPage * chercheursPerPage;
  const indexOfFirstChercheur = indexOfLastChercheur - chercheursPerPage;

  // Utilisation des données de l'API ou des fake data
  const currentChercheurs = chercheurs.slice(
    indexOfFirstChercheur,
    indexOfLastChercheur
  );

  // Calcul du nombre total de pages pour la pagination
  const totalPages = Math.ceil(chercheurs.length / chercheursPerPage);

  // Fonction pour ouvrir le pop-up du chercheur sélectionné
  const openPopup = (chercheur) => {
    setChercheurSelectionne(chercheur);
  };

  // Fonction pour fermer le pop-up
  const closePopup = () => {
    setChercheurSelectionne(null);
  };

  // Gestion du comportement du scroll lorsque le pop-up est ouvert ou fermé
  useEffect(() => {
    if (chercheurSelectionne) {
      document.body.style.overflow = "hidden"; // Désactive le scroll lorsque le pop-up est ouvert
    } else {
      document.body.style.overflow = "auto"; // Réactive le scroll lorsque le pop-up est fermé
    }
  }, [chercheurSelectionne]);

  //**************RETURN STATEMENT********************************************* */
  return (
    <div className="chercheurs-container">
      <div>
        <img
          src={book}
          alt="Chercheurs"
          className="w-full h-100 object-cover"
        />
      </div>

      <div className="">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
            Chercheurs
          </h1>
          <DropdownButton
            icon={faSliders}
            children="Filtrer"
            variant="neutral"
            options={[
              {
                label: "Nom",
                onClick: () => console.log("Nom"),
              },
              {
                label: "Département",
                onClick: () => console.log("Département"),
              },
              {
                label: "Nombre de publication",
                onClick: () => console.log("Nombre de publication"),
              },
            ]}
          />
        </div>
        <div className="mx-auto mt-8 mb-12 bg-gray-300 h-0.5 w-3/4"></div>
        <div className="mx-auto my-5">
          {/* Utilisation de TableGenerique pour afficher les données */}
          <TableGenerique
            columns={[
              { key: "nom", label: "Nom" },
              { key: "departement", label: "Département" },
              { key: "publications", label: "Publications" },
            ]}
            data={currentChercheurs} // Les données actuelles de la page
            onRowClick={openPopup} // Fonction pour ouvrir le pop-up lors du clic sur une ligne
          />
        </div>
        {/* Affichage du pop-up si un chercheur est sélectionné */}
        {chercheurSelectionne && (
          <div className="popup-overlay">
            <div className="popup-content w-[95%] h-[95%] sm:w-[85%] md:w-[80%] ">
              {/* Bouton de fermeture du pop-up */}
              <button className="close-btn" onClick={closePopup}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              {/* Affichage du profil du chercheur sélectionné */}
              <ProfilChercheur chercheur={chercheurSelectionne} />
            </div>
          </div>
        )}
        {/* Pagination pour naviguer entre les pages */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // Met à jour la page actuelle
        />
      </div>
    </div>
  );
  //**************FIN RETURN STATEMENT********************************************* */
}

export default Chercheurs;
