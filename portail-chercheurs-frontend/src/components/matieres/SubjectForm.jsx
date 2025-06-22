import React, { useState, useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

const SubjectForm = ({ allSubjects, currentSubjects, onAttach, onCreateNew }) => {
  const { t } = useContext(LanguageContext);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");

  const validSubjects = allSubjects.filter(
    (subject) => subject.id_matiere !== undefined && subject.id_matiere !== null
  );

  const availableSubjects = validSubjects.filter(
    (subject) =>
      !currentSubjects.some((s) => s.id_matiere === subject.id_matiere)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      setError(t("selectSubjectError"));
      return;
    }

    if (currentSubjects.some((s) => s.id_matiere == selectedSubject)) {
      setError(t("alreadyAttachedError"));
      return;
    }

    onAttach(selectedSubject);
    setSelectedSubject("");
    setError("");
  };

  return (
    <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-secondary)] ">
        {t("addSubject")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-gray)] mb-1">
            {t("selectSubject")}
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">{t("chooseSubjectPlaceholder")}</option>
            {availableSubjects.map((subject) => (
              <option
                key={`subject-${subject.id_matiere}`}
                value={subject.id_matiere}
              >
                {subject.nom_matiere}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t("createNew")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("add")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;