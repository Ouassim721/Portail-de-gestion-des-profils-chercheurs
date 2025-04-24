import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import axios from "../../axios";

export default function UpdateProfileModal({
  isOpen,
  onClose,
  chercheur,
  onUpdate,
}) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (chercheur) {
      setNom(chercheur.nom || "");
      setPrenom(chercheur.prenom || "");
      setEmail(chercheur.email || "");
      setDiscipline(chercheur.discipline || "");
      setPhotoPreview(
        chercheur.photoProfil
          ? `http://localhost:8000/${chercheur.photoProfil}`
          : null
      );
    }
  }, [chercheur]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file)); // Affiche preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("discipline", discipline);
    if (photoFile) {
      formData.append("photoProfil", photoFile);
    }

    try {
      const response = await axios.post(
        `/chercheurs/${chercheur.id}/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-6" />
        <Dialog.Content className="bg-white rounded-xl shadow-lg z-7 p-6 max-w-md w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-xl font-bold mb-4">
            Modifier le Profil
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Discipline"
              className="border p-2 rounded"
            />

            {/* Image Preview */}
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Aperçu"
                className="w-24 h-24 object-cover rounded-full mx-auto mt-2"
              />
            )}

            {/* Champ Fichier Custom */}
            <label className="mt-2 flex flex-col items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
              <span>Choisir une photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "En cours..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
