import React, { useState } from 'react';
import SearchableSelect from '../ui/SearchableSelect';

const SubjectForm = ({ allSubjects, currentSubjects, onAttach }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [error, setError] = useState('');

    // Filtrer les matières non encore associées
    const availableSubjects = allSubjects.filter(
        subject => !currentSubjects.some(s => s.id === subject.id)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSubject) {
            setError('Veuillez sélectionner une matière');
            return;
        }

        if (currentSubjects.some(s => s.id === selectedSubject.id)) {
            setError('Cette matière est déjà associée');
            return;
        }

        onAttach(selectedSubject.id);
        setSelectedSubject(null);
        setError('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Ajouter une matière</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sélectionnez une matière
                    </label>
                    <SearchableSelect
                        options={availableSubjects}
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        getOptionLabel={option => option.nom_matiere}
                        placeholder="Rechercher une matière..."
                    />
                    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubjectForm;