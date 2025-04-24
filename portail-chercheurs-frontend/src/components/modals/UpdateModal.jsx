import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Button from "../ui/Button";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "../../axios";

export default function UpdateModal({ actualite, onUpdate }) {
  const [form, setForm] = useState({ ...actualite });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/actualites/${actualite.id}`,
        form
      );
      onUpdate();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-blue-500 px-2 py-1 rounded text-xl">
        <FontAwesomeIcon icon={faPenToSquare} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-[20%] left-[50%] -translate-x-[50%] bg-white p-6 rounded-xl shadow-xl w-[400px]">
          <Dialog.Title className="text-lg font-bold mb-4">
            Modifier l'actualité
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              placeholder="Titre"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              placeholder="Localisation"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              placeholder="Catégorie"
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              name="date_publication"
              value={form.date_publication}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button type="button" className="text-gray-500 px-3 py-1">
                  Annuler
                </button>
              </Dialog.Close>
              <Button variant="secondary">Sauvegarder</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
