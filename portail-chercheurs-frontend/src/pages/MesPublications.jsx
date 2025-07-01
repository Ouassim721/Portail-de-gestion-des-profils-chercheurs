import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "@/contexts/LanguageContext";
import { logError } from "@/utils/logger";

const MesPublications = () => {
  const { t } = useContext(LanguageContext);
  const [publications, setPublications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: "" });
  const navigate = useNavigate();
  
  const getPublicationId = (pub) => {
    if (pub.identifiant) return pub.identifiant;
    if (pub["dc:identifier"]) return pub["dc:identifier"].replace("SCOPUS_ID:", "");
    if (pub["eid"]) return pub["eid"].replace("2-s2.0-", "");
    if (pub["prism:url"]) return pub["prism:url"].split("/").pop();
    if (pub.id) return `db-${pub.id}`;
    return `index-${pub._index || Math.random().toString(36).substr(2, 9)}`;
  };

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
          response.data?.["search-results"]?.entry || [];

        const pubsWithIds = rawPublications.map((pub, index) => ({
          ...pub,
          identifiant: getPublicationId(pub),
          _index: index,
        }));

        setPublications(pubsWithIds);
        setError(null);
      } catch (err) {
        logError(t("errorLoadingData"), err.response?.data || err.message);
        setError(t("errorLoadingData"));
        setPublications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [t]);

  const handleCheck = (pub) => {
    setSelected((prev) =>
      prev.some((p) => p.identifiant === pub.identifiant)
        ? prev.filter((p) => p.identifiant !== pub.identifiant)
        : [...prev, pub]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === publications.length) {
      setSelected([]);
    } else {
      setSelected([...publications]);
    }
  };

  const handleSave = async () => {
    try {
      const formatted = selected.map((pub) => ({
        identifiant: pub.identifiant || pub["dc:identifier"]?.replace("SCOPUS_ID:", ""),
        titre: pub["dc:title"] || pub.titre || t("noTitleAvailable"),
        date_publication: pub["prism:coverDate"] || pub.date_publication || null,
        auteurs: Array.isArray(pub["dc:creator"])
          ? pub["dc:creator"].join(", ")
          : pub["dc:creator"] || pub.auteurs || t("unknownAuthor"),
        abstract: pub["dc:description"] || pub.abstract || null,
        citation_count: pub["citedby-count"] || pub.citation_count || 0,
        disciplines: pub.disciplines || [],
      }));

      const response = await axios.post(
        "/chercheur/publications",
        { publications: formatted },
        { withCredentials: true }
      );

      setSaveStatus({
        success: true,
        message: response.data.message || t("publicationsSavedSuccess"),
      });
      setSelected([]);
      navigate("/mon-profil");
    } catch (err) {
      logError(t("errorSavingPublications"), err.response?.data || err.message);
      setSaveStatus({
        success: false,
        message: err.response?.data?.error || t("errorSavingPublications"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-4 text-center">
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
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <p className="text-[var(--color-text-secondary)]">
            {publications.length} {t("publicationsFound")} | {selected.length}{" "}
            {t("selectedCount")}
          </p>
          <button
            onClick={toggleSelectAll}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {selected.length === publications.length
              ? t("deselectAll")
              : t("selectAll")}
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
          {t("saveSelections")}
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
                key={pub.identifiant}
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
                      {pub["dc:title"] || pub.titre || t("noTitleAvailable")}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {Array.isArray(pub["dc:creator"])
                        ? pub["dc:creator"].join(", ")
                        : pub["dc:creator"] || pub.auteurs || t("unknownAuthor")}
                    </p>
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>
                        {pub["prism:coverDate"] || pub.date_publication || t("dateNotAvailable")}
                      </span>
                      <span>
                        {t("citationsLabel")}:{" "}
                        {pub["citedby-count"] || pub.citation_count || 0}
                      </span>
                    </div>
                    {(pub["dc:description"] || pub.abstract) && (
                      <details className="mt-2 text-sm text-gray-600">
                        <summary className="cursor-pointer">
                          {t("abstractLabel")}
                        </summary>
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
            {t("noPublicationsAvailable")}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesPublications;