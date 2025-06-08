import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import Button from "../components/ui/Button";
import { LanguageContext } from "../contexts/LanguageContext";
import ChercheurImage from "../assets/chercheurImage-HomePage.jpg";
import ChercheurEnVedette from "../assets/cherchuerEnVedette.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardPublication from "../components/cards/CardPublication";
import pdp from "../assets/chercheur-place-holder.jpg";
import logo from "../assets/logo_scholarhubplusTagligne.jpg";
import {
  faUsers,
  faBook,
  faQuoteRight,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

function Home() {
  const { t, language } = useContext(LanguageContext);
  const [countChercheurs, setCountChercheurs] = useState(null);
  const [countPublications, setCountPublications] = useState(null);
  const [countCitations, setCountCitations] = useState(null);
  const [countDisciplines, setCountDisciplines] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);
  const [publications, setPublications] = useState([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const [errorPublications, setErrorPublications] = useState(null);
  const [chercheurs, setChercheurs] = useState([]);
  const [isLoadingChercheurs, setIsLoadingChercheurs] = useState(false);
  const [errorChercheurs, setErrorChercheurs] = useState(null);

  const locale = language === "fr" ? fr : enUS;

  // Fetch stats
  useEffect(() => {
    axios
      .get("/stats")
      .then((res) => {
        setCountChercheurs(res.data.chercheurs);
        setCountPublications(res.data.publications);
        setCountCitations(res.data.citations);
        setCountDisciplines(res.data.disciplines);
      })
      .catch((err) => console.error(t("errorLoadingData"), err));
  }, [t]);

  // Fetch upcoming events
  useEffect(() => {
    setLoadingEvents(true);
    axios
      .get("/actualites")
      .then((res) => {
        const today = new Date();
        const upcoming = res.data
          .filter((event) => new Date(event.date_publication) > today)
          .sort(
            (a, b) =>
              new Date(a.date_publication) - new Date(b.date_publication)
          )
          .slice(0, 5); // Limite à 5 événements

        setEvents(upcoming);
        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error(t("errorLoadingEvents"), err);
        setErrorEvents(t("errorLoadingEvents"));
        setLoadingEvents(false);
      });
  }, [t]);

  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoadingPublications(true);
      try {
        const response = await axios.get("/publications?page=1&limit=3");
        setPublications(response.data.data);
        setErrorPublications(null);
      } catch (err) {
        setErrorPublications(t("errorLoadingPublications"));
        console.error(err);
      } finally {
        setIsLoadingPublications(false);
      }
    };
    fetchPublications();
  }, [t]);

  useEffect(() => {
    const fetchChercheurs = async () => {
      setIsLoadingChercheurs(true);
      try {
        const response = await axios.get("/chercheurs?page=1&limit=3");
        setChercheurs(response.data.data);
        setErrorChercheurs(null);
      } catch (err) {
        setErrorChercheurs(t("errorLoadingResearchers"));
        console.error(err);
      } finally {
        setIsLoadingChercheurs(false);
      }
    };
    fetchChercheurs();
  }, [t]);

  return (
    <>
      {/* Section Hero */}
      <section className="h-[calc(100vh-74px)] w-full bg-[var(--color-secondary)] relative">
        <div className="flex h-full justify-center lg:justify-start">
          <div className="bg-[var(--color-bg-primary)] h-full p-5 flex justify-center lg:justify-start items-center w-full lg:w-[70%]">
            <div className="flex flex-col gap-10 mb-24 items-center lg:items-start">
              <h1 className="font-bold text-4xl text-center lg:text-left max-w-125 text-[var(--color-text-primary)]">
                {t("homeTitle")}
              </h1>
              <p className="text-neutral-400 font-medium text-lg text-center lg:text-left max-w-125 xl:max-w-full">
                {t("homeSubtitle")}
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <Link to="/chercheurs">
                  <Button variant="primary">{t("exploreResearchers")}</Button>
                </Link>
                <Link to="/about">
                  <Button variant="neutral">{t("learnMore")}</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center bg-[#111827] h-full p-5 w-[30%] relative">
            <img
              src={ChercheurImage}
              alt={t("researcherImageAlt")}
              className="absolute left-[-50%] top-16 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Section Notre impact en chiffres */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              stat: countChercheurs ?? 0,
              label: t("researchersCount"),
              icon: faUsers,
            },
            {
              stat: countPublications ?? 0,
              label: t("publicationsCount"),
              icon: faBook,
            },
            {
              stat: countCitations ?? 0,
              label: t("citations"),
              icon: faQuoteRight,
            },
            {
              stat: countDisciplines ?? 0,
              label: t("domain"),
              icon: faChartPie,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="h-8 w-8 text-[var(--color-primary)]"
                />
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  <CountUp end={item.stat} duration={2} separator="," />+
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)]">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/*Chercheur en vedette*/}
      <section>
        <div className="flex justify-around items-center flex-col lg:flex-row py-4">
          <div className="flex flex-col gap-8 p-4 items-center text-center lg:items-start lg:text-left">
            <h2 className="font-bold text-4xl text-[var(--color-text-primary)]">
              {" "}
              {t("featuredResearchers")}
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {t("featuredResearchersDescription")}
            </p>
            <div>
              <Button variant="secondary">{t("exploreResearchers")}</Button>
            </div>
          </div>
          <img
            src={ChercheurEnVedette}
            alt="Photo d'un chercheur"
            className="w-4/5 lg:w-1/3 rounded-4xl"
          />
        </div>
      </section>
      {/* Timeline des événements scientifiques */}
      <section className="bg-[var(--color-bg-primary)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--color-text-primary)]">
            {t("upcomingEvents")}
          </h2>

          <AnimatePresence>
            {loadingEvents ? (
              <div className="text-center text-[var(--color-text-secondary)]">
                {t("loading")}...
              </div>
            ) : errorEvents ? (
              <div className="text-center text-red-500">{errorEvents}</div>
            ) : events.length === 0 ? (
              <div className="text-center text-[var(--color-text-secondary)]">
                {t("noUpcomingEvents")}
              </div>
            ) : (
              <div className="relative pl-8 border-l-2 border-[var(--color-primary)]">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-8 pl-6 relative"
                  >
                    <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-4" />
                    <Link to={`/actualites/${event.id}`}>
                      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
                          {event.titre}
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {t("dateLabel")}{" "}
                          {format(
                            new Date(event.date_publication),
                            t("dateFormat"),
                            { locale }
                          )}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {t("categoryLabel")}: {event.categorie}
                        </p>
                        <Button variant="outline-primary" size="sm">
                          {t("viewMoreButton")}
                        </Button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* Nouvelle section Publications récentes */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-[var(--color-text-primary)]">
          {t("recentPublications")}
        </h2>

        {isLoadingPublications ? (
          <div className="text-center text-[var(--color-text-secondary)]">
            {t("loading")}...
          </div>
        ) : errorPublications ? (
          <div className="text-center text-red-500">{errorPublications}</div>
        ) : (
          <div className="grid gap-6">
            {publications.map((pub) => (
              <CardPublication
                key={pub.id}
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
            ))}
          </div>
        )}
      </section>
      {/* Nouvelle section Chercheurs */}
      {/* Bannière avec image */}
      <img
        src={logo}
        alt={t("researchTeamAlt")}
        className="w-full h-full object-cover"
      />
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            {t("featuredResearchers")}
          </h2>
          <Link to="/chercheurs">
            <Button variant="neutral">{t("viewAllResearchers")}</Button>
          </Link>
        </div>

        {isLoadingChercheurs ? (
          <div className="text-center text-[var(--color-text-secondary)]">
            {t("loading")}...
          </div>
        ) : errorChercheurs ? (
          <div className="text-center text-red-500">{errorChercheurs}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chercheurs.map((chercheur) => (
              <motion.div
                key={chercheur.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-lg"
              >
                <Link to={`/chercheurs/${chercheur.id}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={chercheur.photo || pdp}
                      alt={t("avatarAlt", {
                        name: `${chercheur.prenom} ${chercheur.nom}`,
                      })}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        Dr. {chercheur.prenom} {chercheur.nom}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {chercheur.university}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {chercheur.disciplines?.map((discipline) => (
                      <span
                        key={discipline.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {discipline.nom}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
