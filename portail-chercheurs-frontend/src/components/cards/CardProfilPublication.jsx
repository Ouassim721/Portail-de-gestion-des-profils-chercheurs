import React, { useState, useContext, useEffect, useRef } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlus,
  faPaperclip,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { logError } from "@/utils/logger";

const CardProfilPublication = ({
  title,
  publicationDate,
  citationCount,
  abstract,
  className,
  isVisible,
  onToggleVisibility,
  disciplines = [],
  publicationId,
  onDisciplinesUpdated,
  isOwner,
}) => {
  const { t, formatDate } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [removingDiscipline, setRemovingDiscipline] = useState(null);
  const [existingDisciplines, setExistingDisciplines] = useState([]);
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [errorLoading, setErrorLoading] = useState(null);
  
  // États pour la gestion du PDF
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        setLoadingDisciplines(true);
        setErrorLoading(null);
        const response = await axios.get("/disciplines");
        setExistingDisciplines(response.data);
      } catch (error) {
        logError("Erreur chargement disciplines:", error);
        setErrorLoading(t("errorLoadingDisciplines"));
      } finally {
        setLoadingDisciplines(false);
      }
    };

    if (isModalOpen) {
      fetchDisciplines();
    }
  }, [isModalOpen, t]);

  const truncateAbstract = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return text;
  };

  const handleAddDiscipline = async () => {
    if (!selectedDisciplineId) return;
    setIsLoading(true);

    try {
      await axios.post("/categoriser", {
        publication_id: publicationId,
        discipline_id: selectedDisciplineId,
      });

      setIsModalOpen(false);
      setSelectedDisciplineId("");
      alert(t("disciplineAddedSuccess"));

      if (onDisciplinesUpdated) onDisciplinesUpdated();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(t("disciplineAlreadyAttached"));
      } else {
        logError("Erreur association discipline:", error);
        alert(t("disciplineAddError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscipline = async (disciplineId) => {
    if (!window.confirm(t("confirmRemoveDiscipline"))) return;

    setRemovingDiscipline(disciplineId);

    try {
      await axios.delete(`/categoriser/${publicationId}/${disciplineId}`);
      alert(t("disciplineRemovedSuccess"));

      if (onDisciplinesUpdated) onDisciplinesUpdated();
    } catch (error) {
      logError("Erreur suppression discipline:", error);

      const errorMsg =
        error.response?.data?.message || t("disciplineRemoveError");
      alert(`${t("disciplineRemoveError")}: ${errorMsg}`);
    } finally {
      setRemovingDiscipline(null);
    }
  };

  // Fonction pour gérer l'upload du PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (file.type !== "application/pdf") {
      alert(t("onlyPdfFiles"));
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await axios.post(`/publications/${publicationId}/upload-pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(t("pdfUploadSuccess"));
      // Rafraîchir les données si nécessaire
      if (onDisciplinesUpdated) onDisciplinesUpdated();
    } catch (error) {
      logError("Erreur lors de l'envoi du PDF:", error);
      alert(t("pdfUploadError"));
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input pour permettre la sélection du même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className={`p-4 bg-[var(--color-bg-primary)] border-b-3 border-gray-300 mb-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
        {title}
      </h3>

      <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-3">
        {publicationDate && (
          <span>
            {t("publishedOn")}{" "}
            {formatDate(publicationDate, { dateStyle: "medium" })}
          </span>
        )}
        {citationCount !== undefined && (
          <span>
            {t("citationsLabel")} {citationCount}
          </span>
        )}
      </div>

      {abstract && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {truncateAbstract(abstract)}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1 items-center">
        {disciplines.map((discipline) => (
          <span
            key={discipline.id}
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded flex items-center"
          >
            {discipline.nom}
            {isOwner && (
              <button
                onClick={() => handleRemoveDiscipline(discipline.id)}
                disabled={removingDiscipline === discipline.id}
                className="ml-1 text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            )}
          </span>
        ))}

        {isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} size="xs" className="mr-1" />
            {t("addDiscipline")}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {isOwner && onToggleVisibility && (
          <>
            <button
              onClick={onToggleVisibility}
              className={`px-3 py-1 text-xs rounded ${
                isVisible
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isVisible ? t("makePrivate") : t("makePublic")}
            </button>
            
            {/* Bouton pour attacher PDF */}
            <label
              className={`px-3 py-1 text-xs rounded bg-blue-900 text-white hover:bg-blue-800 cursor-pointer flex items-center ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="mr-1"
                  />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperclip} className="mr-1" />
                  {t("attachPDF")}
                </>
              )}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfUpload}
                disabled={isUploading}
                ref={fileInputRef}
              />
            </label>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t("addDiscipline")}</h3>

            {loadingDisciplines ? (
              <p className="text-center py-4">{t("loading")}...</p>
            ) : errorLoading ? (
              <p className="text-red-500 mb-4">{errorLoading}</p>
            ) : (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                  {t("selectExistingDiscipline")}
                </label>
                <select
                  value={selectedDisciplineId}
                  onChange={(e) => setSelectedDisciplineId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-[var(--color-text-secondary)] bg-white"
                  disabled={isLoading}
                >
                  <option value="">{t("selectOption")}</option>
                  {existingDisciplines.map((discipline) => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedDisciplineId("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
                disabled={isLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAddDiscipline}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={
                  isLoading || !selectedDisciplineId || loadingDisciplines
                }
              >
                {isLoading ? t("adding") + "..." : t("add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardProfilPublication;