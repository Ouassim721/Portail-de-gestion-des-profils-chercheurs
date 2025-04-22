import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FaFileAlt, FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import SearchBar from "../components/research/SearchBar";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import CardStatPublication from "../components/cards/CardStatPublication";
import CardPublication from "../components/cards/CardPublication";
import axios from "../axios";
const Publications = () => {
  const [publications, setPublications] = useState([]);

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
          <CardStatPublication stat="2,456" title="Chercheurs Actifs" />
          <CardStatPublication variant="secondary" />
          <CardStatPublication />
          <CardStatPublication variant="secondary" />
        </section>
        <section>
          <div>
            {publications.map((pub) => (
              <CardPublication
                key={pub.id}
                title={pub.titre}
                auteur={` ${pub.chercheur.prenom} ${pub.chercheur.nom}`}
                description={pub.abstract}
                date={pub.date_publication}
                departement={pub.discipline.nom}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Publications;
