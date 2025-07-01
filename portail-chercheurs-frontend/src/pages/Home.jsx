import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import Button from "../components/ui/Button";
import ResearcherCard from "../components/cards/ChercheurHomeCard";
import NewsCard from "../components/cards/NewsCard";
import PublicationCard from "../components/cards/PublicationHomeCard";
import { LanguageContext } from "../contexts/LanguageContext";
import ChercheurImage from "../assets/chercheurImage-HomePage.jpg";
import ChercheurEnVedette from "../assets/cherchuerEnVedette.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBook,
  faQuoteRight,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { logError } from "@/utils/logger";

function Home() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [countChercheurs, setCountChercheurs] = useState(null);
  const [countPublications, setCountPublications] = useState(null);
  const [countCitations, setCountCitations] = useState(null);
  const [countDisciplines, setCountDisciplines] = useState(null);
  const [publications, setPublications] = useState([]);
  const [chercheurs, setChercheurs] = useState([]);
  const [actualites, setActualites] = useState([]);

  // Fetch stats
  useEffect(() => {
    axios
      .get("/stats")
      .then((res) => {
        setCountChercheurs(res.data.chercheurs);
        setCountPublications(res.data.publications);
        setCountCitations(res.data.avgCitations || 0);
        setCountDisciplines(res.data.disciplines);
      })
      .catch((err) => logError(t("errorLoadingData"), err));
  }, [t]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchActualitesAccueil = async () => {
      try {
        const response = await axios.get("/actualites/home");
        setActualites(response.data);
      } catch (error) {
        logError("Erreur lors de la récupération des actualités :", error);
      }
    };

    fetchActualitesAccueil();
  }, []);

  const fetchPublication = async (chercheurId) => {
    try {
      const response = await axios.get(
        `/chercheurs/${chercheurId}/publications`
      );

      return response.data.total; 
    } catch (error) {
      logError("Erreur lors du fetch des publications :", error);
      return 0;
    }
  };
  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        const res = await axios.get("/chercheurs?per_page=3");
        const chercheursAvecPub = await Promise.all(
          res.data.data.map(async (chercheur) => {
            const pubCount = await fetchPublication(chercheur.id);
            return { ...chercheur, nombre_publications: pubCount };
          })
        );
        setChercheurs(chercheursAvecPub);
      } catch (error) {
        logError("Erreur lors de la récupération des chercheurs :", error);
      }
    };

    fetchChercheurs();
  }, []);
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await axios.get("/publications?limit=2");
        setPublications(res.data.data);
      } catch (error) {
        logError("Erreur lors de la récupération des publications :", error);
      }
    };

    fetchPublications();
  }, []);

  const goToAbout = () => {
    navigate("/about");
  };
  return (
    <>
      {/* Section Hero */}
      <section className="h-[calc(100vh-74px)] w-full bg-[var(--color-secondary)] static">
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
              label: t("avgCitations"),
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
              <Link to="/chercheurs">
                <Button variant="secondary">{t("exploreResearchers")}</Button>
              </Link>
            </div>
          </div>
          <img
            src={ChercheurEnVedette}
            alt="Photo d'un chercheur"
            className="w-4/5 lg:w-1/3 rounded-4xl"
          />
        </div>
      </section>
      <section className="py-12 px-4 md:px-12 lg:px-20">
        {/* Section Top Researchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {chercheurs.map((chercheur) => (
            <ResearcherCard
              key={chercheur.id}
              name={`${chercheur.prenom} ${chercheur.nom}`}
              domain={chercheur.specialisation}
              publications={chercheur.nombre_publications}
              tag={{ label: chercheur.tag || "Inconnu" }}
              image={chercheur}
            />
          ))}
        </div>

        {/* Section Domaines de Recherche */}
        {/* <h2 className="text-2xl font-bold mb-8 text-center">
          Domaines de Recherche
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <DomainCard
            title="Intelligence Artificielle"
            topics={[
              "Machine Learning",
              "Deep Learning",
              "Natural Language Processing",
              "Computer Vision",
            ]}
            researchers="856"
            publications="235"
            borderColor="border-blue-900"
          />
          <DomainCard
            title="Biotechnologie"
            topics={[
              "Génie Génétique",
              "Biologie Moléculaire",
              "Bioinformatique",
              "Biotechnologie Médicale",
            ]}
            researchers="624"
            publications="189"
            borderColor="border-emerald-500"
          />
          <DomainCard
            title="Physique Quantique"
            topics={[
              "Mécanique Quantique",
              "Optique Quantique",
              "Informatique Quantique",
              "Physique des Particules",
            ]}
            researchers="432"
            publications="156"
            borderColor="border-green-700"
          />
        </div> */}

        {/* Section Publications Récentes */}
        <h2 className="text-2xl font-bold mb-8 text-center text-[var(--color-text-primary)]">
          {t("recentPublications")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {publications.map((publication) => (
            <PublicationCard
              title={publication.titre}
              desc={publication.abstract}
              author={publication.auteurs}
              date={publication.date_publication}
              citations={publication.citation_count}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium px-8 py-4 rounded-xl hover:bg-[var(--color-primary)] hover:text-[var(--color-white)] transition"
            onClick={() => navigate("/publications")}
          >
            {t("viewMorePublications")}
          </button>
        </div>
      </section>
      <section className="bg-blue-950 py-12 lg:py-24 px-4 md:px-12 gap-8 lg:px-20 flex flex-col lg:flex-row lg:justify-between">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h3 className="text-4xl font-semibold text-[var(--color-white)]">
            {t("stayInformed")}
          </h3>
          <p className="text-gray-400">{t("stayInformedDesc")}</p>
        </div>
        <div className="lg:w-1/2 flex lg:justify-end items-center">
          <div>
            <Button
              variant="secondary"
              className="px-6! py-3!"
              onClick={() => navigate("/publications")}
            >
              {t("login")}
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-24 px-4 md:px-12 gap-8 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-[var(--color-text-primary)]">
          {t("news")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 mt-10">
          {actualites.map((actu) => (
            <NewsCard
              key={actu.id}
              titre={actu.titre}
              localisation={actu.localisation}
              description={actu.description}
              categorie={actu.categorie}
              date_publication={actu.date_publication}
              onClick={() => navigate(`/actualites/${actu.id}`)}
            />
          ))}
        </div>
      </section>
<section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
      {t("aboutUsTitle")}
    </h2>
    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
      {t("aboutUsDescription")}
    </p>
    <button
      onClick={goToAbout}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
    >
      {t("learnMoreButton")}
            <svg
              className="ml-3 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
