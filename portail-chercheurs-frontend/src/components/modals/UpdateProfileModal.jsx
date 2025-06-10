import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";
import "./Modal.css";

export default function UpdateProfileModal({
  isOpen,
  onClose,
  chercheur,
  onUpdate,
}) {
  const { t } = useContext(LanguageContext);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("Statut");
  const [about, setAbout] = useState("À propos de moi...");

  useEffect(() => {
    if (chercheur) {
      setNom(chercheur.nom || "");
      setPrenom(chercheur.prenom || "");
      setDiscipline(chercheur.specialisation || "");
      setStatus(chercheur.status || "Statut");
      setAbout(chercheur.about || "À propos de moi...");
      setPhotoPreview(
        chercheur.photoProfil
          ? `http://localhost:8000/${chercheur.photoProfil}`
          : null
      );
    }
  }, [chercheur, t]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoRemove = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/chercheurs/${chercheur.id}/update`,
        { removePhoto: "true" },
        { withCredentials: true }
      );
      setPhotoFile(null);
      setPhotoPreview(null);
      onUpdate(response.data);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("discipline", discipline);
    formData.append("status", status);
    formData.append("about", about);
    if (photoFile) {
      formData.append("photoProfil", photoFile);
    } else if (photoPreview === null) {
      formData.append("removePhoto", "true");
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fadeIn" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-[var(--color-bg-primary)] shadow-xl transition-all duration-300 data-[state=open]:animate-slideUp data-[state=closed]:animate-slideDown focus:outline-none">
          <div className="border-b border-gray-200 px-6 py-4 relative">
            <Dialog.Title className="text-2xl font-semibold text-[var(--color-primary)]">
              {t("modalTitleEditProfile")}
            </Dialog.Title>
            <Dialog.Close className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex-1 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={t("avatarAlt", { name: `${nom} ${prenom}` })}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                      <span className="text-gray-500 text-sm text-center">
                        {t("noPhoto")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="cursor-pointer bg-[var(--color-bg-primary)] border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {t("changePhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handlePhotoRemove}
                      className="bg-[var(--color-bg-primary)] border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {t("removePhoto")}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                {/** Nom **/}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t("lastNameLabel")}
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder={t("lastNamePlaceholder")}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/** Prénom **/}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t("firstNameLabel")}
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder={t("firstNamePlaceholder")}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/** Discipline **/}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t("disciplinePlaceholder")}
                  </label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder={t("disciplinePlaceholder")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/** Statut **/}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t("statusPlaceholder")}
                  </label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder={t("statusPlaceholder")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/** À propos **/}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t("aboutPlaceholder")}
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder={t("aboutPlaceholder")}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 pt-5 border-t border-gray-200">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {t("importCV")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? `…${t("saving")}...` : t("saveButton")}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
