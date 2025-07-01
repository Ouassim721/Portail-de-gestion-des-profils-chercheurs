import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../axios";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import FilePreview from "../components/FilePreview";
import Loader from "../components/ui/Loader";
import { log, logError } from "@/utils/logger";
import { LanguageContext } from "@/contexts/LanguageContext";

const CourseDetailPage = () => {
  const { t, formatDate } = useContext(LanguageContext);
  const { coursId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cours/${coursId}`);
        log("Données complètes du cours:", response.data);

        setCourse(response.data);

        if (response.data.fichier) {
          const baseUrl = api.defaults.baseURL;
          const fileUrl =
            response.data.fichier_url ||
            `${baseUrl.replace("/api", "")}${response.data.fichier}`;

          setFileInfo({
            name: response.data.fichier.split("/").pop(),
            url: fileUrl,
          });
        } else {
          setFileInfo(null);
        }
      } catch (err) {
        logError("Erreur complète:", err);
        setError(t("courseLoadingError"));
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [coursId, t]);

  const handleDelete = async () => {
    if (window.confirm(t("deleteCourseConfirmation"))) {
      try {
        await api.delete(`/cours/${coursId}`);
        navigate(-1);
      } catch (error) {
        logError("Erreur de suppression:", error);
        setError(t("courseDeleteError"));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <Loader />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-secondary)] p-6">
        <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-6">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-red-400" />
            <h2 className="text-xl font-bold mt-4">
              {error || t("courseNotFound")}
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              {t("courseNotFoundDescription")}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t("backToCourseList")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[var(--color-primary)] hover:text-blue-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            {t("backToCourseList")}
          </button>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                  {course.titre}
                </h1>
                <div className="mt-2 flex flex-wrap items-center text-[var(--color-text-secondary)]">
                  <span>
                    {t("publishedOn")}{" "}
                    {formatDate(course.datePublication, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    {t("by")}
                  </span>
                  <span className="font-medium ml-1">
                    {course.chercheur?.prenom} {course.chercheur?.nom}
                  </span>
                </div>
              </div>

              <span className="mt-4 md:mt-0 inline-block px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                {course.matiere?.nom_matiere || t("notSpecified")}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                {t("courseDescription")}
              </h3>
              <p className="text-[var(--color-text-secondary)] whitespace-pre-line p-4 rounded-lg border border-gray-200">
                {course.description || t("noCourseDescription")}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-3 sm:mb-0">
                    {t("attachedFile")}
                  </h3>
                  <a
                    href={fileInfo?.url}
                    download
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center text-sm w-full sm:w-auto justify-center"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    {t("downloadDocument")}
                  </a>
                </div>

                {fileInfo && (
                  <FilePreview
                    file={{
                      name: fileInfo.name,
                      size: 0,
                    }}
                    onRemove={() => {}}
                  />
                )}
              </div>

              {fileInfo && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                    {t("documentPreview")}
                  </h3>
                  <div className="border rounded-lg overflow-hidden h-[500px] flex items-center justify-center bg-gray-50">
                    <iframe
                      src={fileInfo.url}
                      className="w-full h-full"
                      title={t("documentPreview")}
                    />
                  </div>
                </div>
              )}

              {!fileInfo && (
                <div className="max-w-100 mx-auto mt-8 border rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] p-6 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="mt-4 text-lg font-medium text-[var(--color-text-secondary)]">
                    {t("noDocumentAvailable")}
                  </p>
                  <p className="text-[var(--color-gray)]">
                    {t("noPDFForCourse")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to={`/mes-cours/${coursId}/edit`}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            {t("editCourse")}
          </Link>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center transition-colors"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            {t("deleteCourse")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;