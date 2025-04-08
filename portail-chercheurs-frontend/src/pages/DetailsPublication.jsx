import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf, faChartBar, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import discipline from "../assets/discipline.png";

const DetailPublication = () => {
  const navigate = useNavigate();
  const { publicationId } = useParams();

  const publication = {
    id: publicationId,
    title: "Human Emotion Recognition Based on Spatio-Temporal Facial Features",
    authors: "Dr. Sarah Johnson, Prof. Michael Chen",
    abstract: "Cette étude présente une nouvelle méthode de reconnaissance des émotions combinant des caractéristiques spatio-temporelles avec des architectures profondes hybrides...",
    year: 2024,
    domain: "Intelligence Artificielle",
    citations: 45,
    downloads: 1234,
    fullText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    pdfUrl: "#",
    relatedPublications: [
      "Advanced Techniques in Facial Expression Analysis",
      "Deep Learning Approaches for Emotion Analysis"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section d'image avec bouton de retour */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <img 
          src={discipline}
          alt="Contexte de la recherche"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-transparent" />
        {/* Bouton de retour positionné sur l'image */}
        <button
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
        </button>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Titre et métadonnées */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {publication.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <p><FontAwesomeIcon icon={faUserFriends} className="mr-2" />{publication.authors}</p>
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
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Résumé</h2>
                <p className="text-gray-600 leading-relaxed">
                  {publication.abstract}
                </p>
              </section>

              {/* Texte complet */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Contenu Intégral</h2>
                <div className="prose max-w-none">
                  {publication.fullText}
                </div>
              </section>
            </div>

            {/* Colonne droite - Statistiques et actions */}
            <div className="space-y-8">
              {/* Statistiques */}
              <section className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Statistiques</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600"><FontAwesomeIcon icon={faChartBar} className="mr-2" />Citations</span>
                    <span className="font-semibold">{publication.citations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600"><FontAwesomeIcon icon={faFilePdf} className="mr-2" />Téléchargements</span>
                    <span className="font-semibold">{publication.downloads}</span>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="space-y-4">
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                  Télécharger le PDF
                </button>
                
                <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Voir les citations
                </button>
              </div>

              {/* Publications liées */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Publications Associées</h2>
                <ul className="space-y-3">
                  {publication.relatedPublications.map((pub, index) => (
                    <li key={index} className="text-gray-600 hover:text-indigo-600 cursor-pointer">
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