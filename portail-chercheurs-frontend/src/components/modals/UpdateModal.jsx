import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useContext } from "react";
import Button from "../ui/Button";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

export default function UpdateModal({ actualite, onUpdate }) {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ ...actualite });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/actualites/${actualite.id}`, form);
      onUpdate();
    } catch (err) {
      logError(t("updateError"), err);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={t("editAction", { name: actualite.titre })}
        className="text-blue-500 px-2 py-1 rounded text-xl"
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-[20%] left-[50%] -translate-x-[50%] bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-xl w-[400px]">
          <Dialog.Title className="text-lg font-bold mb-4">
            {t("modalTitleEditNews")}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              placeholder={t("titrePlaceholder")}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              placeholder={t("locationPlaceholder")}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              placeholder={t("categoryPlaceholder")}
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
              placeholder={t("descriptionPlaceholder")}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button type="button" className="text-gray-500 px-3 py-1">
                  {t("cancelButton")}
                </button>
              </Dialog.Close>
              <Button variant="secondary">{t("saveButton")}</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
