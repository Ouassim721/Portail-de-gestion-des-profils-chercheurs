import React, { useState } from 'react';

const SubjectForm = ({ allSubjects, currentSubjects, onAttach }) => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [error, setError] = useState('');

    // Filtrer uniquement les matières avec id_matiere valide
    const validSubjects = allSubjects.filter(
        subject => subject.id_matiere !== undefined && subject.id_matiere !== null
    );

    // Filtrer les matières non associées
    const availableSubjects = validSubjects.filter(
        subject => !currentSubjects.some(s => s.id_matiere === subject.id_matiere)
    );

const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubject) {
        setError('Veuillez sélectionner une matière');
        return;
    }

    // Pas besoin de conversion numérique, l'API gère les strings
    const subjectId = selectedSubject;
    
    // Vérification locale de l'association
    if (currentSubjects.some(s => s.id_matiere == subjectId)) {
        setError('Cette matière est déjà associée');
        return;
    }

    onAttach(subjectId);
    setSelectedSubject('');
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
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                    >
                        <option value="">-- Choisir une matière --</option>
                        {availableSubjects.map(subject => (
                            <option key={`subject-${subject.id_matiere}`} value={subject.id_matiere}>
                                {subject.nom_matiere}
                            </option>
                        ))}
                    </select>
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