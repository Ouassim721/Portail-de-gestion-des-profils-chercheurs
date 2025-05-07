import React, { useState, useContext } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import { Navigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";

axios.defaults.withCredentials = true;

const CreationActualite = () => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    titre: "",
    localisation: "",
    description: "",
    categorie: "",
    date_publication: "",
  });
  const [documentPdf, setDocumentPdf] = useState(null);
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setDocumentPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (documentPdf) data.append("document_pdf", documentPdf);

      await axios.post("/api/actualites", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(t("creationSuccess"));
      setRedirect(true);
    } catch (error) {
      console.error(error.response?.data || error);
      setMessage(t("creationError"));
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard/adminactualite" />;
  }

  return (
<<<<<<< HEAD
    <div className="p-4 max-w-md mx-auto bg-[var(--color-bg-primary)] shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Créer une actualité</h2>
=======
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t("createNewsTitle")}</h2>
>>>>>>> badreddine
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titre"
          placeholder={t("titrePlaceholder")}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="localisation"
          placeholder={t("locationPlaceholder")}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder={t("descriptionPlaceholder")}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="categorie"
          placeholder={t("categoryPlaceholder")}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          name="document_pdf"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="date_publication"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <Button className="w-full" type="submit">
          {t("addButton")}
        </Button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default CreationActualite;
