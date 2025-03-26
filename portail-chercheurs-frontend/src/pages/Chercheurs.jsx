import { useState } from "react";
import "./Chercheurs.css"; // Import du fichier CSS
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
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
  const chercheursPerPage = 10; // Nombre de chercheurs par page

  // Calcul des chercheurs à afficher
  const indexOfLastChercheur = currentPage * chercheursPerPage;
  const indexOfFirstChercheur = indexOfLastChercheur - chercheursPerPage;
  const currentChercheurs = chercheursData.slice(
    indexOfFirstChercheur,
    indexOfLastChercheur
  );

  // Nombre total de pages
  const totalPages = Math.ceil(chercheursData.length / chercheursPerPage);

  return (
    <div className="chercheurs-container">
      {/* Grande image en haut */}
      <div className="header-image">
        <img src={book} alt="Chercheurs" />
      </div>

      <div className="flex justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
        <h1 className="font-bold text-3xl">Chercheurs</h1>
        <Button variant="neutral">
          <FontAwesomeIcon icon={faSliders} /> Filtrer
        </Button>
      </div>
      <div className="mx-auto mt-8 mb-12 bg-[var(--color-gray)] h-0.25 w-3/4"></div>

      {/* Tableau des chercheurs */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="text-left">Nom</th>
              <th className="text-left">Département</th>
              <th className="text-left">Publications</th>
            </tr>
          </thead>
          <tbody>
            {currentChercheurs.map((chercheur) => (
              <tr key={chercheur.id}>
                <td>
                  {/* Lien vers la page complète */}
                  <Link
                    to={`/profil-chercheur/${chercheur.id}`}
                    className="text-blue-600 underline"
                  >
                    {chercheur.nom}
                  </Link>
                  {/* Affichage du pop-up */}
                  <button
                    onClick={() => setChercheurSelectionne(chercheur)}
                    className="ml-4 text-gray-600"
                  >
                    (Voir en pop-up)
                  </button>
                </td>
                <td>{chercheur.departement}</td>
                <td>{chercheur.publications}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Affichage du modal si un chercheur est sélectionné */}
        {chercheurSelectionne && (
          <ProfilChercheur
            chercheur={chercheurSelectionne}
            onClose={() => setChercheurSelectionne(null)}
          />
        )}
      </div>

      {/* Pagination réutilisable */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Chercheurs;
