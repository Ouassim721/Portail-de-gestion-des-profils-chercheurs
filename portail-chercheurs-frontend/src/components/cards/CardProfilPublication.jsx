import React, { useState, useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  const [disciplineName, setDisciplineName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [removingDiscipline, setRemovingDiscipline] = useState(null);

  const truncateAbstract = (text) => {
    const words = text.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return text;
  };

  const handleAddDiscipline = async () => {
    if (!disciplineName.trim()) return;
    setIsLoading(true);

    try {
      const searchRes = await axios.get(
        `/disciplines?search=${disciplineName}`
      );
      let disciplineId;

      if (searchRes.data.length > 0) {
        disciplineId = searchRes.data[0].id;
      } else {
        const createRes = await axios.post("/disciplines", {
          nom: disciplineName,
        });
        disciplineId = createRes.data.id;
      }

      // Tentative d'association
      try {
        await axios.post("/categoriser", {
          publication_id: publicationId,
          discipline_id: disciplineId,
        });
      } catch (error) {
        // Gestion spécifique des erreurs 409
        if (error.response?.status === 409) {
          alert(t("disciplineAlreadyAttached"));
          return; // On arrête le processus
        }
        throw error; // On propage les autres erreurs
      }

      setIsModalOpen(false);
      setDisciplineName("");
      alert(t("disciplineAddedSuccess"));

      if (onDisciplinesUpdated) onDisciplinesUpdated();
    } catch (error) {
      logError("Erreur ajout discipline:", error);

      // Message différent pour les conflits
      if (error.response?.status !== 409) {
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

      // Message plus informatif pour l'utilisateur
      const errorMsg =
        error.response?.data?.message || t("disciplineRemoveError");
      alert(`${t("disciplineRemoveError")}: ${errorMsg}`);
    } finally {
      setRemovingDiscipline(null);
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
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t("addDiscipline")}</h3>

            <input
              type="text"
              value={disciplineName}
              onChange={(e) => setDisciplineName(e.target.value)}
              placeholder={t("disciplineNamePlaceholder")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              disabled={isLoading}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAddDiscipline}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading || !disciplineName.trim()}
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
