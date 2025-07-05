import { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
  faChevronDown,
  faUsers,
  faBook,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import SearchBarPublications from "../components/research/SearchBarPublications";
import Button from "../components/ui/Button";
import DropdownButton from "../components/ui/DropdownButton";
import DropdownScroll from "../components/ui/DropDownScroll";
import CardStatPublication from "../components/cards/CardStatPublication";
import CardPublication from "../components/cards/CardPublication";
import CommentsSection from "../components/comments/CommentsSection";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";
import useAuth from "../hooks/useAuth";
import { logError } from "@/utils/logger";

const Publications = () => {
  const { t } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [publications, setPublications] = useState([]);
  const [countChercheurs, setcountChercheurs] = useState(null);
  const [countPublications, setcountPublications] = useState(null);
  const [countCitations, setcountCitations] = useState(null);
  const [countDiscipline, setCountDiscipline] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const isAuthenticated = useAuth();
  const loader = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    axios
      .get(
        `/publications?page=${page}&limit=10${
          selectedYear ? `&year=${selectedYear}` : ""
        }${selectedDiscipline ? `&discipline_id=${selectedDiscipline}` : ""}${
          searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
        }`
      )
      .then((res) => {
        setPublications((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setHasMore(res.data.hasMore);
        if (page === 1) setInitialLoad(false);
      })
      .catch((error) => {
        logError("Error fetching publications:", error);
        setHasMore(false);
      })
      .finally(() => setIsLoading(false));
  }, [page, selectedYear, selectedDiscipline, searchTerm]);

  // Réinitialiser les filtres lorsqu'ils changent
  useEffect(() => {
    setPage(1);
    setPublications([]);
    setHasMore(true);
    setInitialLoad(true);
  }, [searchTerm, selectedYear, selectedDiscipline]);

  useEffect(() => {
    axios
      .get("/stats")
      .then((response) => {
        setcountChercheurs(response.data.chercheurs);
        setcountPublications(response.data.publications);
        setcountCitations(response.data.avgCitations);
        setCountDiscipline(response.data.disciplines);
      })
      .catch((error) => {
        logError(t("errorLoadingData"), error);
      });
  }, [t]);

  useEffect(() => {
    axios
      .get("/disciplines")
      .then((response) => {
        setDisciplines(response.data);
      })
      .catch((error) => {
        logError(t("errorLoadingData"), error);
      });
  }, [t]);

  useEffect(() => {
    axios
      .get("/publications/years")
      .then((response) => {
        setAvailableYears(response.data);
      })
      .catch((error) => {
        logError(t("errorLoadingData"), error);
      });
  }, [t]);

  const nombrePublications =
    countPublications !== null ? countPublications : "...";
  const nombreChercheurs = countChercheurs !== null ? countChercheurs : "...";
  const nombreCitations = countCitations !== null ? countCitations : "...";
  const nombreDisciplines = countDiscipline !== null ? countDiscipline : "...";

  return (
    <div className="min-h-screen">
      <div className="w-full bg-[#003366] flex flex-col lg:flex-row gap-4 items-center p-4">
        <div className="w-full px-2">
          <SearchBarPublications
            className="p-4 w-full"
            placeHolder={t("searchPublications")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter"}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-8 sm:justify-between items-center">
          <div className="w-full flex justify-between sm:justify-start lg:justify-end sm:gap-6 px-2">
            <DropdownButton
              icon={faChevronDown}
              children={selectedYear ? selectedYear.toString() : t("year")}
              variant="neutral"
              iconPosition="right"
              options={[
                { label: t("allYears"), onClick: () => setSelectedYear(null) },
                ...availableYears.map((year) => ({
                  label: year.toString(),
                  onClick: () => setSelectedYear(year),
                })),
              ]}
              className="w-full sm:w-auto"
            />

            {/* <DropdownButton
              icon={faChevronDown}
              children={
                selectedDiscipline
                  ? disciplines.find((d) => d.id === selectedDiscipline)?.nom
                  : "Discipline"
              }
              variant="neutral"
              iconPosition="right"
              options={[
                {
                  label: t("allDomains"),
                  onClick: () => setSelectedDiscipline(null),
                },
                ...disciplines.map((discipline) => ({
                  label: discipline.nom,
                  onClick: () => setSelectedDiscipline(discipline.id),
                })),
              ]}
              className="dropdown-scrollable w-full sm:w-auto"
            /> */}
            <DropdownScroll
              label="Discipline"
              selectedLabel={
                selectedDiscipline
                  ? disciplines.find((d) => d.id === selectedDiscipline)?.nom
                  : "Discipline"
              }
              options={[
                {
                  label: "Toutes les disciplines",
                  onClick: () => setSelectedDiscipline(null),
                },
                ...disciplines.map((d) => ({
                  label: d.nom,
                  onClick: () => setSelectedDiscipline(d.id),
                })),
              ]}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-8">
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 my-6 mb-10 place-items-center">
          <CardStatPublication
            stat={nombreChercheurs}
            title={t("activeResearchers")}
            icon={faUsers}
          />
          <CardStatPublication
            stat={nombrePublications}
            title={t("publications")}
            variant="secondary"
            icon={faBook}
          />
          <CardStatPublication
            stat={nombreCitations}
            title={t("avgCitations")}
            icon={faQuoteRight}
          />
          <CardStatPublication
            stat={nombreDisciplines}
            title={t("disciplines")}
            variant="secondary"
            icon={faBook}
          />
        </section>
        <section>
          <div className="relative">
            {initialLoad && (
              <div className="flex justify-center my-8">
                <p className="text-xl text-[var(--color-text-secondary)]">
                  {t("loading")}...
                </p>
              </div>
            )}

            {!initialLoad && publications.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                {t("noPublicationsFound")}
              </div>
            )}

            {publications
              .filter((pub) => pub.visible)
              .map((pub) => (
                <div key={pub.id} className="mb-10">
                  <CardPublication
                    id={pub.id}
                    title={pub.titre}
                    auteur={`${pub.chercheur.prenom} ${pub.chercheur.nom}`}
                    university={pub.chercheur.university}
                    departement={
                      pub.disciplines.length > 0
                        ? pub.disciplines[0].nom
                        : t("noDiscipline")
                    }
                    description={pub.abstract}
                    category={pub.disciplines.map((d) => d.nom)}
                    date={pub.date_publication}
                    citations={pub.citation_count}
                    pdf_path={pub.pdf_path}
                  />
                  <CommentsSection publicationId={pub.id} />
                </div>
              ))}

            {isLoading && !initialLoad && (
              <div className="flex justify-center my-4">
                <p className="text-xl text-gray-500">{t("loading")}</p>{" "}
              </div>
            )}

            <div ref={loader} className="h-1" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Publications;
