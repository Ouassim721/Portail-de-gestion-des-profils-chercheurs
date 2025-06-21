import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ui/ProgressBar";
/**
 * Composant pour sélectionner et enregistrer des publications Scopus
 */
const SelectionPublications = () => {
  const [publications, setPublications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: "" });
  const navigate = useNavigate();
  // Fonction pour extraire un identifiant unique d'une publication
  const getPublicationId = (pub) => {
    // Priorité 1: dc:identifier (format Scopus)
    if (pub["dc:identifier"]) {
      return pub["dc:identifier"].replace("SCOPUS_ID:", "");
    }
    // Priorité 2: eid (format Scopus alternatif)
    if (pub["eid"]) {
      return pub["eid"].replace("2-s2.0-", "");
    }
    // Priorité 3: URL Scopus
    if (pub["prism:url"]) {
      return pub["prism:url"].split("/").pop();
    }
    // Priorité 4: Identifiant interne (si existant)
    if (pub.id) {
      return `db-${pub.id}`;
    }
    // En dernier recours: index (non idéal mais nécessaire comme fallback)
    return `index-${pub._index || Math.random().toString(36).substr(2, 9)}`;
  };

  // Chargement des publications depuis l'API
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/chercheur/publications", {
          withCredentials: true,
        });

        const rawPublications =
          response.data?.publications ||
          response.data?.results ||
          response.data?.["search-results"]?.entry ||
          [];

        // Ajout de l'identifiant unique à chaque publication
        const pubsWithIds = rawPublications.map((pub, index) => ({
          ...pub,
          identifiant: getPublicationId(pub),
          _index: index, // Garde une trace de l'index original comme fallback
        }));

        setPublications(pubsWithIds);
        setError(null);
      } catch (err) {
        console.error("Erreur détaillée:", err.response?.data || err.message);
        setError("Erreur lors du chargement des publications");
        setPublications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, []);

  // Gère la sélection/désélection
  const handleCheck = (pub) => {
    setSelected((prev) =>
      prev.some((p) => p.identifiant === pub.identifiant)
        ? prev.filter((p) => p.identifiant !== pub.identifiant)
        : [...prev, pub]
    );
  };
  //fonction permettant la selection/deselection de tous les publications
  const toggleSelectAll = () => {
    if (selected.length === publications.length) {
      setSelected([]);
    } else {
      setSelected([...publications]);
    }
  };
  // Enregistrement des publications sélectionnées
  const handleSave = async () => {
    try {
      const formatted = selected.map((pub) => ({
        identifiant:
          pub.identifiant || pub["dc:identifier"]?.replace("SCOPUS_ID:", ""),
        titre: pub["dc:title"] || pub.titre || "Titre non disponible",
        date_publication:
          pub["prism:coverDate"] || pub.date_publication || null,
        auteurs: Array.isArray(pub["dc:creator"])
          ? pub["dc:creator"].join(", ")
          : pub["dc:creator"] || pub.auteurs || "Auteur inconnu",
        abstract: pub["dc:description"] || pub.abstract || null,
        citation_count: pub["citedby-count"] || pub.citation_count || 0,
        discipline_id: pub.discipline_id || 1,
      }));

      const response = await axios.post(
        "/chercheur/publications", // Note: vérifiez bien l'URL (publications vs publications)
        { publications: formatted },
        {
          withCredentials: true,
        }
      );

      setSaveStatus({
        success: true,
        message:
          response.data.message || "Publications sauvegardées avec succès",
      });
      setSelected([]);
      navigate("/");
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data || err.message);
      setSaveStatus({
        success: false,
        message: err.response?.data?.error || "Erreur lors de l'enregistrement",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-4 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProgressBar currentStep={2} />
      <div className="max-w-5xl mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <p className="text-[var(--color-text-secondary)]">
              {publications.length} publications trouvées | {selected.length}{" "}
              sélectionnées
            </p>
            <button
              onClick={toggleSelectAll}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {selected.length === publications.length
                ? "Tout désélectionner"
                : "Tout sélectionner"}
            </button>
          </div>
          <Button
            onClick={handleSave}
            disabled={selected.length === 0}
            className={`${
              selected.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            Enregistrer les sélections
          </Button>
        </div>
        {saveStatus.message && (
          <div
            className={`mb-4 p-3 rounded ${
              saveStatus.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {saveStatus.message}
          </div>
        )}
        <div className="space-y-3">
          {publications.length > 0 ? (
            publications.map((pub) => {
              const isSelected = selected.some(
                (p) => p.identifiant === pub.identifiant
              );
              return (
                <div
                  key={pub.identifiant} // Utilisation de l'identifiant unique
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-[var(--color-bg-primary)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={() => handleCheck(pub)}
                      checked={isSelected}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {pub["dc:title"] || pub.titre}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {Array.isArray(pub["dc:creator"])
                          ? pub["dc:creator"].join(", ")
                          : pub["dc:creator"] || pub.auteurs}
                      </p>
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>
                          {pub["prism:coverDate"] || pub.date_publication}
                        </span>
                        <span>
                          Citations:{" "}
                          {pub["citedby-count"] || pub.citation_count || 0}
                        </span>
                      </div>
                      {(pub["dc:description"] || pub.abstract) && (
                        <details className="mt-2 text-sm text-gray-600">
                          <summary className="cursor-pointer">Résumé</summary>
                          <p className="mt-1 italic">
                            {pub["dc:description"] || pub.abstract}
                          </p>
                        </details>
                      )}
                    </div>
                  </label>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              Aucune publication disponible
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectionPublications;
