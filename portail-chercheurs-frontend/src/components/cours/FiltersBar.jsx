import React from 'react';

const FiltersBar = ({ filter, setFilter, selectedSubject, setSelectedSubject, courses }) => {
    const uniqueSubjects = [...new Set(courses.map(c => c.matiere))]
        .filter(subject => subject !== null)
        .sort((a, b) => a.nom_matiere.localeCompare(b.nom_matiere));

    return (
        <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recherche
                </label>
                <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                </label>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Toutes les matières</option>
                    {uniqueSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.nom_matiere}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="flex items-end">
                <button
                    onClick={() => {
                        setFilter('');
                        setSelectedSubject('');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors"
                >
                    Réinitialiser
                </button>
            </div>
        </div>
    );
};

export default FiltersBar;