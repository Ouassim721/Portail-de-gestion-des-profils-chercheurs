import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/ui/Button";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { LanguageContext } from "../contexts/LanguageContext";

export default function DetailsActualite() {
  const { t, formatDate } = useContext(LanguageContext);
  const { id } = useParams();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        const response = await axios.get(`/actualites/${id}`);
        setActualite(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActualite();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        <p className="ml-4">{t("loading")}</p>
      </div>
    );
  }

  if (!actualite) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("actualiteNotFoundTitle")}
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-2">
            {t("actualiteNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-[var(--color-bg)] min-h-screen">
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
        {actualite.image_url && (
          <div className="h-64 w-full overflow-hidden">
            <img
              src={`http://localhost:8000/storage/${actualite.image_url}`}
              alt={actualite.titre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Métadonnées */}
          <div className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] mb-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-1 text-[var(--color-text-secondary)]" />
              <span>
                {t("dateLabel")}{" "}
                {formatDate(actualite.created_at, { dateStyle: "long" })}
              </span>
            </div>
            <span className="text-[var(--color-text-secondary)]">•</span>
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1 text-[var(--color-text-secondary)]" />
              <span className="capitalize">
                {t("categoryLabel")}: {actualite.categorie}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            {actualite.titre}
          </h1>

          {actualite.localisation && (
            <div className="flex items-center text-[var(--color-primary)] mb-6">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{actualite.localisation}</span>
            </div>
          )}

          <div className="prose max-w-none text-[var(--color-text-primary)] mb-8">
            <p className="whitespace-pre-line">{actualite.description}</p>
          </div>

          <div className="flex space-x-4 mt-8 pt-6 border-t border-[var(--color-border)]">
            <Button variant="neutral" onClick={() => window.history.back()}>
              {t("backButton")}
            </Button>
            <Button variant="secondary">{t("shareButton")}</Button>
          </div>
        </div>
      </div>

      {/* Section commentaires */}
      <div className="mt-12 bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
            {t("commentsTitle")} ({actualite.commentairesCount || 0})
          </h3>
        </div>
        <div className="p-6">
          {/* Exemple de commentaire */}
          <div className="space-y-4">{/* … */}</div>

          <form className="mt-6">
            <div className="mb-4">
              <textarea
                id="comment"
                rows={3}
                className="w-full sm:text-sm border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] text-[var(--color-text-primary)] p-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                placeholder={t("addCommentPlaceholder")}
              ></textarea>
            </div>
            <Button variant="secondary">{t("postCommentButton")}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
