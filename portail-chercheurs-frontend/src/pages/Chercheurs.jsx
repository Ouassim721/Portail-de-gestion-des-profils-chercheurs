import { useState, useEffect } from "react";
import "./Chercheurs.css"; // Import du fichier CSS
import { Link } from "react-router-dom";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import TableGenerique from "../components/TableGenerique";
import Pagination from "../components/Pagination";
import ProfilChercheur from "../components/ProfilChercheur";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";

// Données simulées (remplace-les par les résultats de l'API une fois disponible)
const chercheursData = [
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
  { id: 3, nom: "Dr. Yassine Amine", departement: "Physique", publications: 8 },
  { id: 4, nom: "Dr. Nadia Amrani", departement: "Chimie", publications: 12 },
  {
    id: 5,
    nom: "Dr. Ahmed Loukili",
    departement: "Biologie",
    publications: 20,
  },
  {
    id: 6,
    nom: "Dr. Fatima Zahra",
    departement: "Génétique",
    publications: 17,
  },
  {
    id: 7,
    nom: "Dr. Hassan Chafiq",
    departement: "Statistique",
    publications: 22,
  },
  {
    id: 8,
    nom: "Dr. Karim Bellarbi",
    departement: "Économie",
    publications: 9,
  },
  {
    id: 9,
    nom: "Dr. Amina Lahmidi",
    departement: "Informatique",
    publications: 14,
  },
  {
    id: 10,
    nom: "Dr. Salim Bennani",
    departement: "Physique",
    publications: 11,
  },
  {
    id: 11,
    nom: "Dr. Mustafa Kchikech",
    departement: "Informatique",
    publications: 10,
  },
  {
    id: 12,
    nom: "Dr. Isam Matazi",
    departement: "Mathématiques",
    publications: 15,
  },
  {
    id: 13,
    nom: "Dr. Ouassim Derja",
    departement: "Physique",
    publications: 8,
  },
  { id: 14, nom: "Dr. Nadia Amrani", departement: "Chimie", publications: 12 },
  {
    id: 15,
    nom: "Dr. Badereddine Benhila",
    departement: "Biologie",
    publications: 20,
  },
  {
    id: 16,
    nom: "Dr. Youssef Mourdi",
    departement: "Génétique",
    publications: 17,
  },
  {
    id: 17,
    nom: "Dr. Nawal Alioua",
    departement: "Statistique",
    publications: 22,
  },
  {
    id: 18,
    nom: "Dr. Mounir Afilal",
    departement: "Économie",
    publications: 9,
  },
  {
    id: 19,
    nom: "Dr. Ihsane Ouadnouni",
    departement: "Informatique",
    publications: 14,
  },
  {
    id: 20,
    nom: "Dr. Abdesadik Bendarag",
    departement: "Physique",
    publications: 11,
  },
];

function Chercheurs() {
  const [chercheurSelectionne, setChercheurSelectionne] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const chercheursPerPage = 10;

  const indexOfLastChercheur = currentPage * chercheursPerPage;
  const indexOfFirstChercheur = indexOfLastChercheur - chercheursPerPage;
  const currentChercheurs = chercheursData.slice(
    indexOfFirstChercheur,
    indexOfLastChercheur
  );
  const totalPages = Math.ceil(chercheursData.length / chercheursPerPage);

  const openPopup = (chercheur) => {
    setChercheurSelectionne(chercheur);
  };

  const closePopup = () => {
    setChercheurSelectionne(null);
  };

  useEffect(() => {
    if (chercheurSelectionne) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [chercheurSelectionne]);

  return (
    <div className="chercheurs-container">
      <div>
        <img
          src={book}
          alt="Chercheurs"
          className="w-full h-100 object-cover"
        />
      </div>

      <div className="flex justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
        <h1 className="font-bold text-3xl">Chercheurs</h1>
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

      <div className="mx-auto my-5 w-4/5">
        <TableGenerique
          columns={[
            { key: "nom", label: "Nom" },
            { key: "departement", label: "Département" },
            { key: "publications", label: "Publications" },
          ]}
          data={currentChercheurs}
          onRowClick={openPopup}
        />
      </div>

      {chercheurSelectionne && (
        <div className="popup-overlay">
          <div className="popup-content">
            {/* Bouton de fermeture */}
            <button className="close-btn" onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {/* Affichage du profil */}
            <ProfilChercheur chercheur={chercheurSelectionne} />
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Chercheurs;
