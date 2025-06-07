// src/components/matieres/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import FileIcon from './FileIcon';

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
                    <FileIcon filename={course.fichier} />
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </Link>
                    <button
                        onClick={() => onDelete(course.id_cours)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Supprimer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
