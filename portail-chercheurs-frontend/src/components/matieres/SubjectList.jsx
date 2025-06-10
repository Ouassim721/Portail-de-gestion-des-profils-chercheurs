import React from 'react';
import { TrashIcon, BookOpenIcon } from '@heroicons/react/24/solid';

const SubjectList = ({ subjects, onDetach }) => {
    if (subjects.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpenIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune matière associée</h3>
                <p className="mt-1 text-gray-500">Commencez par ajouter une matière que vous enseignez</p>
            </div>
        );
    }

    const handleDetachClick = (subjectId, subjectName) => {
        const confirmDetach = window.confirm(
            `Êtes-vous sûr de vouloir retirer la matière "${subjectName}" ?\n\nCette action est irréversible.`
        );
        
        if (confirmDetach) {
            onDetach(subjectId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {subjects.map(subject => (
                    <li key={subject.id_matiere} className="p-4 flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{subject.nom_matiere}</span>
                        <button
                            onClick={() => handleDetachClick(subject.id_matiere, subject.nom_matiere)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                        >
                            <TrashIcon className="h-5 w-5 mr-1" />
                            Retirer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubjectList;