import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const CourseCard = ({ course, researcherId, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                        {course.matiere?.nom_matiere || 'Non spécifié'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(course.datePublication).toLocaleDateString()}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.titre}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                </p>
                
                <div className="flex items-center mt-auto">
                    <DocumentTextIcon className="w-5 h-5 text-red-500" />
                    <span className="ml-2 text-sm text-gray-500 truncate">
                        {course.fichier?.split('/').pop()}
                    </span>
                </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <Link
                    to={`/chercheurs/${researcherId}/cours/${course.id_cours}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Voir détails
                </Link>
                
                <div className="flex space-x-2">
                    <Link
                        to={`/chercheurs/${researcherId}/cours/${course.id_cours}/edit`}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Modifier"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={() => onDelete(course.id_cours)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Supprimer"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;