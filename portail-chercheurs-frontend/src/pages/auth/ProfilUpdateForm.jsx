import React, { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import Loader from "../../components/ui/Loader";
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
    axios.get("/profile", { withCredentials: true }).then((res) => {
      const { nom, prenom } = res.data;
      setForm((prev) => ({ ...prev, nom, prenom }));
      setLoading(false);
    });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/chercheur/profil", form, { withCredentials: true })
      .then(() => navigate("/selection-publications"));
  };

  if (loading) return <Loader text={t("loading")} />;

  return (
<<<<<<< HEAD
    <div className="max-w-xl mx-auto mt-10 bg-[var(--color-bg-primary)] p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Complétez votre profil</h2>
=======
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        {t("completeProfileFormTitle")}
      </h2>
>>>>>>> badreddine
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom"
          value={form.nom}
          disabled
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="prenom"
          value={form.prenom}
          disabled
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="scopus_author_id"
          placeholder={t("scopusIdPlaceholder")}
          required
          value={form.scopus_author_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="discipline"
          placeholder={t("disciplinePlaceholder")}
          value={form.discipline}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("submitButton")}
        </button>
      </form>
    </div>
  );
};

export default ProfilUpdateForm;
