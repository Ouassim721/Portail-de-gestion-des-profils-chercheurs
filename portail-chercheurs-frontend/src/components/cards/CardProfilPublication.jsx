import React, { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

const CardProfilPublication = ({
  title,
  publicationDate,
  citationCount,
  abstract,
  className,
  isVisible,
  onToggleVisibility,
}) => {
  const { t, formatDate } = useContext(LanguageContext);

  const truncateAbstract = (text) => {
    const words = text.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return text;
  };

  return (
    <div
      className={`p-4 bg-[var(--color-bg-primary)] border-b-3 border-gray-300 mb-4 ${className}`}
    >
      {/* Titre de la publication */}
      {title && (
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
          {title}
        </h3>
      )}

      {/* Date de publication et nombre de citations */}
      <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-3">
        {publicationDate && (
          <span>
            {t("publishedOn")} {formatDate(publicationDate, { dateStyle: 'medium' })}
          </span>
        )}
        {citationCount !== undefined && (
          <span>
            {t("citationsLabel")} {citationCount}
          </span>
        )}
      </div>

      {/* Abstract avec troncation si nécessaire */}
      {abstract && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {truncateAbstract(abstract)}
        </p>
      )}

      {/* Bouton de visibilité */}
      {onToggleVisibility && (
        <button
          onClick={onToggleVisibility}
          className={`mt-2 px-3 py-1 text-xs rounded ${
            isVisible 
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isVisible ? t("makePrivate") : t("makePublic")}
        </button>
      )}
    </div>
  );
};

export default CardProfilPublication;