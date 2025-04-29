import { useState, useEffect } from "react";
import {
  faFilter,
  faChevronDown,
  faUsers,
  faBook,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../components/research/SearchBar";
import Button from "../components/ui/Button";
import DropdownButton from "../components/ui/DropdownButton";
import CardStatPublication from "../components/cards/CardStatPublication";
import CardPublication from "../components/cards/CardPublication";
import CommentsSection from "../components/comments/CommentsSection";
import axios from "../axios";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [countChercheurs, setcountChercheurs] = useState(null);
  const [countPublications, setcountPublications] = useState(null);
  const [countCitations, setcountCitations] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/publications")
      .then((response) => {
        setPublications(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des publications :", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("/stats")
      .then((response) => {
        setcountChercheurs(response.data.chercheurs);
        setcountPublications(response.data.publications);
        setcountCitations(response.data.citations);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de chercheurs:",
          error
        );
      });
  }, []);

  const nombrePublications =
    countPublications !== null ? countPublications : "Chargement...";
  const nombreChercheurs =
    countChercheurs !== null ? countChercheurs : "Chargement...";
  const nombreCitations =
    countChercheurs !== null ? countCitations : "Chargement...";
  return (
    <div className="min-h-screen ">
      <div className="w-full bg-[var(--color-primary)] flex flex-col lg:flex-row gap-4 items-center p-4">
        <div className="w-full px-2">
          <SearchBar
            className="p-4 w-full"
            placeHolder="Rechercher des publications..."
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-8 sm:justify-between items-center">
          <div className="w-full flex justify-between sm:justify-start lg:justify-end sm:gap-6 px-2">
            <DropdownButton
              icon={faChevronDown}
              children="Année"
              variant="neutral"
              iconPosition="right"
              options={[
                {
                  label: "2025",
                  onClick: () => console.log("2025"),
                },
                {
                  label: "2024",
                  onClick: () => console.log("2024"),
                },
                {
                  label: "2023",
                  onClick: () => console.log("2023"),
                },
                {
                  label: "2022",
                  onClick: () => console.log("2022"),
                },
              ]}
            />
            <DropdownButton
              icon={faChevronDown}
              children="Domaine"
              variant="neutral"
              iconPosition="right"
              options={[
                {
                  label: "IA",
                  onClick: () => console.log("IA"),
                },
                {
                  label: "Math",
                  onClick: () => console.log("Math"),
                },
                {
                  label: "Data Science",
                  onClick: () => console.log("Data Science"),
                },
                {
                  label: "Machine Learning",
                  onClick: () => console.log("Machine Learning"),
                },
              ]}
            />
          </div>
          <Button
            variant="secondary"
            icon={faFilter}
            className="w-full sm:w-auto flex justify-center items-center "
          >
            Filtrer
          </Button>
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-8">
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 my-6 mb-10 place-items-center">
          <CardStatPublication
            stat={nombreChercheurs}
            title="Chercheurs Actifs"
            icon={faUsers}
          />{" "}
          <CardStatPublication
            stat={nombrePublications}
            variant="secondary"
            icon={faBook}
          />
          <CardStatPublication
            stat={nombreCitations}
            title="Citations"
            icon={faQuoteRight}
          />
          <CardStatPublication variant="secondary" />
        </section>
        <section>
          <div>
          {publications.map((pub) => (
  <div key={pub.id} className="mb-10">
    <CardPublication
      title={pub.titre}
      auteur={`${pub.chercheur.prenom} ${pub.chercheur.nom}`}
      university={pub.chercheur.university}
      departement={pub.discipline.nom}
      description={pub.abstract}
      category={pub.discipline.keywords || []}
      date={pub.date_publication}
      citations={pub.citation_count}
      pdf_path={pub.pdf_path}
    />
    <CommentsSection publicationId={pub.id} />
  </div>
))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Publications;
