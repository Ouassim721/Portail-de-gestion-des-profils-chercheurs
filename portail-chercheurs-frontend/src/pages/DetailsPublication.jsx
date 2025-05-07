import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilePdf,
  faChartBar,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import discipline from "../assets/discipline.png";

const DetailPublication = () => {
  const navigate = useNavigate();
  const { publicationId } = useParams();

  const publication = {
    id: publicationId,
    title: "Human Emotion Recognition Based on Spatio-Temporal Facial Features",
    authors: "Dr. Sarah Johnson, Prof. Michael Chen",
    abstract:
      "Cette étude présente une nouvelle méthode de reconnaissance des émotions combinant des caractéristiques spatio-temporelles avec des architectures profondes hybrides...",
    year: 2024,
    domain: "Intelligence Artificielle",
    citations: 45,
    downloads: 1234,
    fullText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    pdfUrl: "#",
    relatedPublications: [
      "Advanced Techniques in Facial Expression Analysis",
      "Deep Learning Approaches for Emotion Analysis",
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Section d’image et bouton « Retour » */}
      <div className="relative h-64 md:h-96 bg-[var(--color-bg-secondary)]">
        <img
          src={discipline}
          alt="Contexte de la recherche"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-transparent" />
        {/* Bouton de retour positionné sur l'image */}
        <button
          aria-label={t("backBtnAria")}
          className="absolute top-4 left-4 bg-[var(--color-bg)] rounded-full p-2 shadow-md hover:bg-[var(--color-bg-secondary)] transition-colors z-10"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
        </button>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-6 md:p-8">
          {/* Titre et métadonnées */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {publication.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-[var(--color-text-secondary)]">
              <p>
                <FontAwesomeIcon
                  icon={faUserFriends}
                  className="mr-2 text-[var(--color-primary)]"
                />
                {publication.authors}
              </p>
              <p>{publication.year}</p>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {publication.domain}
              </span>
            </div>
          </div>

          {/* Grid contenu principal */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Colonne gauche - Contenu principal */}
            <div className="md:col-span-2 space-y-8">
              {/* Résumé */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                  {t("abstractTitle")}
                </h2>
                <p className="text-[var(--color-text-primary)] leading-relaxed">
                  {publication.abstract}
                </p>
              </section>

              {/* Texte complet */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                  {t("fullTextTitle")}
                </h2>
                <div className="prose max-w-none text-[var(--color-text-primary)]">
                  {publication.fullText}
                </div>
              </section>
            </div>

            {/* Colonne droite - Statistiques et actions */}
            <div className="space-y-8">
              {/* Statistiques */}
              <section className="bg-[var(--color-bg)] p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                  {t("statsTitle")}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-primary)]">
                      <FontAwesomeIcon
                        icon={faChartBar}
                        className="mr-2 text-[var(--color-primary)]"
                      />
                      {t("citationsLabel")}
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {publication.citations}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-primary)]">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="mr-2 text-[var(--color-primary)]"
                      />
                      {t("downloadsLabel")}
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {publication.downloads}
                    </span>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="space-y-4">
                <Button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                  {t("downloadPdfBtn")}
                </Button>

                <Button
                  variant="secondary"
                  className="w-full flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Voir les citations
                </Button>
              </div>

              {/* Publications liées */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                  {t("relatedPubsTitle")}
                </h2>
                <ul className="space-y-3">
                  {publication.relatedPublications.map((pub, idx) => (
                    <li
                      key={idx}
                      className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors"
                    >
                      • {pub}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPublication;
