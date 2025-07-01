import React, { useContext } from "react";
import PropTypes from "prop-types";
import { LanguageContext } from "../../contexts/LanguageContext";

const NewsCard = ({
  titre,
  localisation,
  description,
  categorie,
  date_publication,
  onClick,
}) => {
  const { t, formatDate } = useContext(LanguageContext);

  return (
    <div className="max-w-md mx-auto w-full h-full bg-[var(--color-bg-primary)] rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-6 flex flex-col justify-between h-full w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            {categorie}
          </span>
          <span className="text-gray-500 text-sm">
            {formatDate(date_publication)}
          </span>
        </div>

        <h2 className="mt-2 text-xl font-bold text-[var(--color-text-secondary)]">
          {titre}
        </h2>

        {localisation && (
          <div className="mt-1 flex items-center">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-1 text-[var(--color-text-secondary)] text-sm">
              {localisation}
            </span>
          </div>
        )}

        <p className="mt-3 text-[var(--color-text-secondary)]">{description}</p>

        <div className="mt-4">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={onClick}
          >
            {t("learnMore")} →
          </button>
        </div>
      </div>
    </div>
  );
};

NewsCard.propTypes = {
  titre: PropTypes.string.isRequired,
  localisation: PropTypes.string,
  description: PropTypes.string.isRequired,
  categorie: PropTypes.string.isRequired,
  date_publication: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default NewsCard;