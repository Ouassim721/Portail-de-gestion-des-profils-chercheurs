import { useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

axios.defaults.withCredentials = true;

const CreationActualite = () => {
  const [formData, setFormData] = useState({
    titre: "",
    localisation: "",
    description: "",
    categorie: "",
    date_publication: "",
  });

  const [documentPdf, setDocumentPdf] = useState(null); // pour gérer le fichier PDF séparément
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setDocumentPdf(e.target.files[0]); // récupère le fichier sélectionné
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("titre", formData.titre);
      data.append("localisation", formData.localisation);
      data.append("description", formData.description);
      data.append("categorie", formData.categorie);
      data.append("date_publication", formData.date_publication);

      if (documentPdf) {
        data.append("document_pdf", documentPdf); // très important pour ajouter le fichier
      }

      const response = await axios.post(
        "http://localhost:8000/api/actualites",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Actualité ajoutée avec succès !");
      console.log("Réponse :", response.data);
    } catch (error) {
      console.error("Erreur :", error.response?.data);
      setMessage("Erreur lors de l'ajout !");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Créer une actualité</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="localisation"
          placeholder="Localisation"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="categorie"
          placeholder="Catégorie"
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
        />
        <Button className="w-full">Ajouter</Button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default CreationActualite;
