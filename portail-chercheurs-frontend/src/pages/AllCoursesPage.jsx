// src/pages/AllCoursesPage.jsx

import React, { useState, useEffect, useContext } from "react";
import api from "../axios";
import Loader from "../components/ui/Loader";
import {
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FiltersBar from "../components/cours/FiltersBar";
import { LanguageContext } from "../contexts/LanguageContext";

const AllCoursesPage = () => {
  const { t } = useContext(LanguageContext);

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // filtres
  const [filter, setFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await api.get("/cours");
        setCourses(resp.data);
        setFilteredCourses(resp.data);
      } catch {
        setError(t("errorLoadingCourses"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  useEffect(() => {
    let result = courses;
    if (filter) {
      const term = filter.toLowerCase();
      result = result.filter(
        (c) =>
          c.titre.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      );
    }
    if (selectedSubject) {
      result = result.filter((c) => c.matiere?.id_matiere === selectedSubject);
    }
    setFilteredCourses(result);
  }, [filter, selectedSubject, courses]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(t("locale"), {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const openPreviewModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  const closePreviewModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-6">
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <DocumentTextIcon className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">{t("tryChangingFilters")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("retryButton")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aperçu en modal */}
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-xl overflow-auto max-h-[90vh] w-full max-w-4xl">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedCourse.titre}</h2>
                  <button onClick={closePreviewModal}>
                    <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full mb-4">
                  {selectedCourse.matiere?.nom_matiere ||
                    t("subjectUnspecified")}
                </span>
                <p className="mb-6 text-[var(--color-text-secondary)]">
                  {selectedCourse.description || t("noDescription")}
                </p>

                {selectedCourse.fichier ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {t("attachedFile")}
                      </h3>
                      <a
                        href={`${api.defaults.baseURL.replace(
                          "/api",
                          ""
                        )}/storage/${selectedCourse.fichier}`}
                        download
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        {t("download")}
                      </a>
                    </div>
                    <div className="h-[500px] border rounded overflow-hidden">
                      <iframe
                        src={`${api.defaults.baseURL.replace(
                          "/api",
                          ""
                        )}/storage/${selectedCourse.fichier}`}
                        className="w-full h-full"
                        title="Preview"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 border rounded bg-gray-50">
                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="mt-4 text-gray-700">{t("noFilePreview")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("allCoursesTitle")}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {t("allCoursesSubtitle")}
          </p>
        </div>

        {/* Barre de filtres */}
        <div className="mb-8">
          <div className="flex items-center text-[var(--color-text-secondary)] mb-4">
            <FunnelIcon className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">{t("filterCoursesLabel")}</h2>
          </div>
          <FiltersBar
            filter={filter}
            setFilter={setFilter}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            courses={courses}
          />
          <div className="mt-4 text-sm text-[var(--color-text-secondary)] flex justify-between">
            <div>
              {t("coursesFound", { count: filteredCourses.length })}
              {(filter || selectedSubject) && (
                <>
                  {t("coursesFoundWithTotal", {
                    found: filteredCourses.length,
                    total: courses.length,
                  })}
                </>
              )}
            </div>
            {(filter || selectedSubject) && (
              <button
                onClick={() => {
                  setFilter("");
                  setSelectedSubject("");
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                {t("resetFilters")}
              </button>
            )}
          </div>
        </div>

        {/* Liste */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-medium mt-4">
              {courses.length === 0
                ? t("noCoursesAvailable")
                : t("noCoursesMatch")}
            </h3>
            <p className="mt-2 text-gray-600">
              {courses.length === 0
                ? t("noCoursesYet")
                : t("tryChangingFilters")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[var(--color-bg-primary)] rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="p-6 flex flex-col justify-between h-full w-full">
                  <div className="flex justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {course.matiere?.nom_matiere || t("subjectUnspecified")}
                    </span>
                  </div>
                  <button
                    onClick={() => openPreviewModal(course)}
                    className="text-left w-full font-bold text-[var(--color-text-primary)] text-xl mb-2 hover:text-blue-600"
                  >
                    {course.titre}
                  </button>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">
                    {course.description || t("noDescription")}
                  </p>
                  <div className="flex space-x-4 text-sm text-[var(--color-gray)]">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {t("instructorByLabel", {
                        first: course.chercheur?.prenom,
                        last: course.chercheur?.nom,
                      })}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {t("publishedOnLabel", {
                        date: formatDate(course.datePublication),
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
