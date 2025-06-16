import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../axios";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
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
        console.error(t("errorLoadingData"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualite();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen relative">
        <Loader text={t("loading")} className="static!" />
      </div>
    );
  }

  if (!actualite) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("actualiteNotFoundTitle")}
          </h2>
          <p className="text-gray-600 mt-2">{t("actualiteNotFoundDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-lg overflow-hidden">
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
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(actualite.created_at)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              <span className="capitalize">{actualite.categorie}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {actualite.titre}
          </h1>

          {actualite.localisation && (
            <div className="flex items-center text-blue-900 mb-6">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{actualite.localisation}</span>
            </div>
          )}

          <div className="prose max-w-none text-gray-700 mb-8">
            <p className="whitespace-pre-line">{actualite.description}</p>
          </div>

          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button variant="neutral" onClick={() => window.history.back()}>
              {t("back")}
            </Button>
            <Button>{t("share")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
