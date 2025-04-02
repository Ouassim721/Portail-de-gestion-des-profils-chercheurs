import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

export default function UserSettingsPopup() {
  const [name, setName] = useState("Nom de l'utilisateur");
  const [status, setStatus] = useState("Statut");
  const [about, setAbout] = useState("À propos de moi...");
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handlePhotoRemove = () => {
    setPhoto(null);
  };
  return (
    <div>
      {/* Affichage du profil */}
      <h2 className="text-xl font-semibold mb-4">Modifier le profil</h2>
      <div className="flex justify-between border-2 h-full border-gray-300">
        <div className="hidden md:block md:sidebar w-[20%] h-full border-r-2 border-gray-300"></div>
        <div className="flex flex-col w-full px-12 py-6">
          <div className="flex gap-10 items-center mb-4">
            {photo ? (
              <img
                src={photo}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                <span className="text-white text-center">Aucune photo</span>
              </div>
            )}
            <div className="flex gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} /> Changer
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
              {photo && (
                <button
                  onClick={handlePhotoRemove}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </button>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-1 outline-neutral-300 text-neutral-500 focus:text-neutral-900 focus:outline-neutral-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Statut</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-1 outline-neutral-300 text-neutral-500 focus:text-neutral-900 focus:outline-neutral-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">À propos</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3 py-2 rounded-lg resize-none outline-1 outline-neutral-300 text-neutral-500 focus:text-neutral-900 focus:outline-neutral-500"
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <Button variant="secondary">Importer CV</Button>
            <Button>Sauvegarder</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
