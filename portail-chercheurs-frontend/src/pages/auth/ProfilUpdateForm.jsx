import React, { useEffect, useState, useContext } from "react";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
import ProgressBar from "../../components/ui/ProgressBar";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";

const ProfilUpdateForm = () => {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    scopus_author_id: "",
    discipline: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/profile", { withCredentials: true })
      .then((res) => {
        const { nom, prenom } = res.data;
        setForm((prev) => ({ ...prev, nom, prenom }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/chercheur/profil", form, { withCredentials: true })
      .then(() => navigate("/selection-publications"))
      .catch(console.error);
  };

  if (loading) return <Loader />;

  return (
    <>
      <ProgressBar currentStep={1} />
      <div className="max-w-xl mx-auto mt-10 bg-[var(--color-bg-primary)] p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">
          {t("completeProfileFormTitle")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("lastNameLabel")}
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("firstNameLabel")}
            </label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Scopus ID */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("scopusIdPlaceholder")}
            </label>
            <input
              type="text"
              name="scopus_author_id"
              placeholder={t("scopusIdPlaceholder")}
              required
              value={form.scopus_author_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Discipline */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("disciplinePlaceholder")}
            </label>
            <input
              type="text"
              name="discipline"
              placeholder={t("disciplinePlaceholder")}
              value={form.discipline}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-blue-950"
          >
            {t("submitButton")}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilUpdateForm;
