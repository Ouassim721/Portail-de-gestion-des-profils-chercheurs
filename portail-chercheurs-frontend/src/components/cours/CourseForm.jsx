// src/components/matieres/CourseForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

function CourseForm() {
  const { t } = useContext(LanguageContext);
  const { id, coursId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(coursId);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    datePublication: new Date().toISOString().split("T")[0],
    id_matiere: "",
    fichier: null,
  });
  const [existingFile, setExistingFile] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMatieres();
    if (isEdit) fetchCours();
  }, [id, coursId, isEdit]);

  const fetchMatieres = async () => {
    try {
      const res = await api.get(`/chercheurs/${id}/matieres`);
      setMatieres(res.data);
    } catch (e) {
      logError(t("errorFetchingSubjects"), e);
    }
  };

  const fetchCours = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/chercheurs/${id}/cours/${coursId}`);
      const d = res.data;
      setFormData({
        titre: d.titre,
        description: d.description,
        datePublication: d.datePublication.split("T")[0],
        id_matiere: d.id_matiere.toString(),
        fichier: null,
      });
      setExistingFile(d.fichier?.split("/").pop());
    } catch (e) {
      logError(t("errorFetchingCourse"), e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    let err = {};
    if (file) {
      if (file.type !== "application/pdf") err.fichier = t("errorFileType");
      if (file.size > 10 * 1024 * 1024) err.fichier = t("errorFileSize");
      if (Object.keys(err).length) {
        setErrors((prev) => ({ ...prev, ...err }));
        e.target.value = null;
        return;
      }
    }
    setFormData((prev) => ({ ...prev, fichier: file }));
    setErrors((prev) => ({ ...prev, fichier: null }));
  };

  const validate = () => {
    let ne = {};
    if (!formData.titre) ne.titre = t("errorTitleRequired");
    if (!formData.description) ne.description = t("errorDescRequired");
    if (!formData.id_matiere) ne.id_matiere = t("errorSelectSubject");
    if (!isEdit && !formData.fichier) ne.fichier = t("errorFileRequired");
    if (formData.fichier) {
      if (formData.fichier.type !== "application/pdf")
        ne.fichier = t("errorFileType");
      if (formData.fichier.size > 10 * 1024 * 1024)
        ne.fichier = t("errorFileSize");
    }
    setErrors(ne);
    return !Object.keys(ne).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Créer FormData correctement
    const fd = new FormData();
    fd.append("titre", formData.titre);
    fd.append("description", formData.description);
    fd.append("datePublication", formData.datePublication);
    fd.append("id_matiere", formData.id_matiere);

    // Ajouter le fichier s'il existe
    if (formData.fichier) {
      fd.append("fichier", formData.fichier);
    }

    try {
      // Configuration pour les fichiers
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        fd.append("_method", "PUT");
        await api.post(`/chercheurs/${id}/cours/${coursId}`, fd, config);
      } else {
        // Pour la création, fichier est obligatoire
        await api.post(`/chercheurs/${id}/cours`, fd, config);
      }

      navigate(`/chercheurs/${id}/cours`);
    } catch (err) {
      let msg = t("errorOccurred");
      if (err.response?.status === 422) {
        const se = err.response.data.errors,
          fe = {};
        Object.keys(se).forEach((k) => (fe[k] = se[k][0]));
        setErrors(fe);
        return;
      }
      if (err.response?.data?.message) msg = err.response.data.message;
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 my-8 bg-[var(--color-bg-primary)] rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        {isEdit ? t("editCourse") : t("newCourse")}
      </h1>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-[var(--color-text-secondary)] mb-2">
            {t("labelTitle")} *
          </label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] ${
              errors.titre ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.titre && (
            <p className="mt-1 text-red-500 text-sm">{errors.titre}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[var(--color-text-secondary)] mb-2">
            {t("labelDescription")} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-[var(--color-text-secondary)] mb-2">
            {t("labelDate")}
          </label>
          <input
            type="date"
            name="datePublication"
            value={formData.datePublication}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[var(--color-text-primary)]"
            disabled={loading}
          />
        </div>

        {/* Matière */}
        <div>
          <label className="block text-[var(--color-text-secondary)] mb-2">
            {t("labelSubject")} *
          </label>
          <select
            name="id_matiere"
            value={formData.id_matiere}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.id_matiere ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading || !matieres.length}
          >
            <option value="">{t("chooseSubjectPlaceholder")}</option>
            {matieres.map((m) => (
              <option key={m.id_matiere} value={m.id_matiere}>
                {m.nom_matiere}
              </option>
            ))}
          </select>
          {errors.id_matiere && (
            <p className="mt-1 text-red-500 text-sm">{errors.id_matiere}</p>
          )}
        </div>

        {/* Fichier */}
        <div>
          <label className="block text-[var(--color-text-secondary)] mb-2">
            {t("labelFile")} {isEdit ? t("optional") : "*"}
          </label>
          {isEdit && existingFile && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                {t("currentFile", { name: existingFile })}
              </p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={`w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] ${
              errors.fichier ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.fichier && (
            <p className="mt-1 text-red-500 text-sm">{errors.fichier}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{t("fileHelp")}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/chercheurs/${id}/cours`)}
            className="px-5 py-2 border border-gray-300 rounded-lg text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-gray-700"
            disabled={loading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEdit ? t("updating") : t("creating")}
              </span>
            ) : isEdit ? (
              t("updateCourse")
            ) : (
              t("createCourse")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
