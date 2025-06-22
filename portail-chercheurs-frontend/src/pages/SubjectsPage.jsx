import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import SubjectForm from "../components/matieres/SubjectForm";
import SubjectList from "../components/matieres/SubjectList";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import useAuth from "../hooks/useAuth";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { LanguageContext } from "../contexts/LanguageContext";
import { logError } from "@/utils/logger";

const SubjectsPage = () => {
  const { user } = useAuth();
  const { t } = useContext(LanguageContext);
  const id = user?.id;

  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [researcherResponse, allResponse] = await Promise.all([
          api.get(`/chercheurs/${id}/matieres`),
          api.get("/matieres"),
        ]);

        setSubjects(researcherResponse.data);
        setAllSubjects(allResponse.data);
      } catch (error) {
        logError(t("errorFetchingSubjects"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  const handleAttach = async (subjectId) => {
    try {
      const response = await api.post(`/chercheurs/${id}/matieres`, {
        id_matiere: subjectId,
      });

      setSubjects((prev) => [
        ...prev,
        {
          id_matiere: subjectId,
          nom_matiere: response.data.nom_matiere,
        },
      ]);
    } catch (error) {
      logError(t("errorAttachingSubject"), error);
      alert(error.response?.data?.message || t("errorOccurredAttaching"));
    }
  };

  const handleCreateAndAttach = async () => {
    if (!newSubjectName.trim()) {
      alert(t("subjectNameRequired"));
      return;
    }

    try {
      const response = await api.post(
        `/chercheurs/${id}/matieres/attach-or-create`,
        {
          nom_matiere: newSubjectName,
        }
      );

      setSubjects((prev) => [...prev, response.data]);
      setAllSubjects((prev) => [...prev, response.data]);
      setShowCreateModal(false);
      setNewSubjectName("");
    } catch (error) {
      logError(t("errorCreatingSubject"), error);
      alert(error.response?.data?.message || t("errorOccurredCreating"));
    }
  };

  const handleDetach = async (subjectId) => {
    try {
      await api.delete(`/chercheurs/${id}/matieres/${subjectId}`);
      setSubjects((prev) => prev.filter((s) => s.id_matiere !== subjectId));
    } catch (error) {
      logError(t("errorDetachingSubject"), error);
      try {
        const res = await api.get(`/chercheurs/${id}/matieres`);
        setSubjects(res.data);
      } catch (refreshError) {
        logError(t("errorRefreshingSubjects"), refreshError);
      }
      alert(error.response?.data?.message || t("errorOccurredDetaching"));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {t("mySubjects")}
            </h1>
            <div className="flex">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  showForm
                    ? "bg-gray-500 hover:bg-gray-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {showForm ? (
                  <>
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    {t("cancel")}
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t("addSubject")}
                  </>
                )}
              </button>
            </div>
          </div>

          {showForm && (
            <SubjectForm
              allSubjects={allSubjects}
              currentSubjects={subjects}
              onAttach={handleAttach}
              onCreateNew={() => setShowCreateModal(true)}
            />
          )}

          <SubjectList subjects={subjects} onDetach={handleDetach} />

          {/* Modal pour créer une nouvelle matière */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                  {t("createNewSubject")}
                </h2>
                <input
                  type="text"
                  placeholder={t("subjectNamePlaceholder")}
                  className="w-full border rounded px-5 py-4 mb-4 text-[var(--color-text-secondary)]"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateAndAttach();
                    }
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewSubjectName("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleCreateAndAttach}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    {t("createAndAttach")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SubjectsPage;
