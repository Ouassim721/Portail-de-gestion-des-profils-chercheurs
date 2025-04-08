import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FaFileAlt, FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import SearchBar from "../components/research/SearchBar";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import CardStatPublication from "../components/cards/CardStatPublication";
import CardPublication from "../components/cards/CardPublication";
const PublicationsPage = () => {
  /* const publications = [
    {
      id: 1,
      title: "Les nouvelles méthodes d'IA en médecine",
      author: "Dr. Marie Dupont",
      date: "2024-03-15",
      status: "Publié",
    },
    {
      id: 2,
      title: "Optimisation des algorithmes quantiques",
      author: "Prof. Jean Martin",
      date: "2024-03-12",
      status: "En révision",
    },
  ];*/

  return (
    <div className="min-h-screen ">
      <div className="w-full bg-[var(--color-primary)] flex flex-col lg:flex-row gap-4 items-center p-4">
        <div className="w-full px-2">
          <SearchBar
            className="p-4 w-full"
            placeHolder="Rechercher des publications..."
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
          <div className="w-full flex justify-between sm:justify-start lg:justify-end sm:gap-8 px-2">
            <DropdownButton
              icon={faChevronDown}
              children="Année"
              variant="neutral"
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
            <CardPublication />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicationsPage;
