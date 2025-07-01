import React, { useEffect, useState, useContext } from "react";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ui/ProgressBar";
import { logError } from "@/utils/logger";
import { LanguageContext } from "../../contexts/LanguageContext";

const SelectionPublications = () => {
  const { t } = useContext(LanguageContext);
  const [publications, setPublications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: "" });
  const navigate = useNavigate();

  // ... (code existant inchangé)

  return (
    <>
      <ProgressBar currentStep={2} />
      <div className="max-w-5xl mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <p className="text-[var(--color-text-secondary)]">
              {t("publicationsFound", { count: publications.length })} | 
              {t("selectedCount", { count: selected.length })}
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
            publications.map((pub) => (
              // ... (code existant avec traduction des labels)
              <div key={pub.identifiant}>
                {/* ... */}
                <h3 className="font-semibold">
                  {pub["dc:title"] || pub.titre || t("noTitleAvailable")}
                </h3>
                <p className="text-sm">
                  {Array.isArray(pub["dc:creator"])
                    ? pub["dc:creator"].join(", ")
                    : pub["dc:creator"] || pub.auteurs || t("unknownAuthor")}
                </p>
                <div className="flex justify-between">
                  <span>
                    {pub["prism:coverDate"] || pub.date_publication || t("dateNotAvailable")}
                  </span>
                  <span>
                    {t("citationsLabel")}: {pub["citedby-count"] || pub.citation_count || 0}
                  </span>
                </div>
                {pub.abstract && (
                  <details>
                    <summary>{t("abstractLabel")}</summary>
                    <p>{pub.abstract}</p>
                  </details>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              {t("noPublicationsAvailable")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectionPublications;