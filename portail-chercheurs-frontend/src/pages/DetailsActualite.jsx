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
import { logError } from "@/utils/logger";
import { log } from "@/utils/logger";

export default function DetailsActualite() {
  const { t, formatDate } = useContext(LanguageContext);
  const { id } = useParams();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        const response = await axios.get(`/actualites/${id}`);
        setActualite(response.data);

        if (response.data.document_pdf) {
          // Récupérer la baseURL depuis la configuration d'axios
          const baseUrl = axios.defaults.baseURL;

          // Construire l'URL manuellement
          const fileUrl =
            response.data.document_pdf_url ||
            `${baseUrl.replace("/api", "")}/storage/${
              response.data.document_pdf
            }`;

          log("URL utilisée:", fileUrl);

          setFileInfo({
            name: response.data.document_pdf.split("/").pop(),
            url: fileUrl,
          });
        } else {
          log("Aucun fichier associé à ce cours");
          setFileInfo(null);
        }
      } catch (error) {
        logError(t("errorLoadingData"), error);
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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("actualiteNotFoundTitle")}
          </h2>
          <p className="[var(--color-text-secondary)] mt-2">
            {t("actualiteNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] mb-4">
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

          <h1 className="text-3xl font-bold mb-4">{actualite.titre}</h1>

          {actualite.localisation && (
            <div className="flex items-center text-[var(--color-primary)] mb-6">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{actualite.localisation}</span>
            </div>
          )}

          <div className="prose max-w-none text-[var(--color-text-secondary)] mb-8">
            <p className="whitespace-pre-line text-lg">
              {actualite.description}
            </p>
          </div>

          {fileInfo && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Aperçu du document
              </h3>
              <div className="border rounded-lg overflow-hidden h-[500px] flex items-center justify-center bg-gray-50">
                <iframe
                  src={fileInfo.url}
                  className="w-full h-full"
                  title="Aperçu du document"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button onClick={() => window.history.back()}>{t("back")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
