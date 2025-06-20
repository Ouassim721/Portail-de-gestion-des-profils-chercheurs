// src/components/cours/FiltersBar.jsx

import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';

const FiltersBar = ({ filter, setFilter, selectedSubject, setSelectedSubject, courses }) => {
  const { t } = useContext(LanguageContext);

  // Construire la liste unique des matières
  const uniqueSubjects = courses
    .map(c => c.matiere)
    .filter(subj => subj && subj.id_matiere !== undefined)
    .reduce((acc, subj) => {
      if (!acc.some(x => x.id_matiere === subj.id_matiere)) acc.push(subj);
      return acc;
    }, [])
    .sort((a, b) => a.nom_matiere.localeCompare(b.nom_matiere));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('searchLabel')}
        </label>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sélection de la matière */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('subjectLabel')}
        </label>
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t('allSubjectsOption')}</option>
          {uniqueSubjects.map(subject => (
            <option
              key={subject.id_matiere}
              value={subject.id_matiere}
            >
              {subject.nom_matiere}
            </option>
          ))}
        </select>
      </div>

      {/* Réinitialiser */}
      <div className="flex items-end">
        <button
          onClick={() => {
            setFilter('');
            setSelectedSubject('');
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors"
        >
          {t('resetFilters')}
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;
