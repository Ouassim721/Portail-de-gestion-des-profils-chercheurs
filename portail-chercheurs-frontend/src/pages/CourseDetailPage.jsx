import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../axios';
import FileIcon from '../components/cours/FileIcon';

const CourseDetailPage = () => {
    const { id, coursId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/cours/${coursId}`);
                setCourse(response.data);
            } catch (err) {
                setError('Erreur lors du chargement du cours');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourse();
    }, [coursId]);

    const handleDelete = async () => {
        if (window.confirm('Voulez-vous vraiment supprimer ce cours définitivement?')) {
            try {
                await api.delete(`/chercheurs/${id}/cours/${coursId}`);
                navigate(`/chercheurs/${id}/cours`);
            } catch (error) {
                console.error('Erreur de suppression:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <div className="text-red-500 mb-4">{error || 'Cours non trouvé'}</div>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-blue-600 hover:text-blue-800"
                >
                    &larr; Retour à la liste des cours
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour à la liste
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{course.titre}</h1>
                        <p className="text-gray-600 mt-1">
                            Publié le {new Date(course.datePublication).toLocaleDateString()} par 
                            <span className="font-medium"> {course.chercheur?.prenom} {course.chercheur?.nom}</span>
                        </p>
                    </div>
                    
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                        {course.matiere?.nom_matiere || 'Non spécifié'}
                    </span>
                </div>

                <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileIcon filename={course.fichier} />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Fichier attaché</h3>
                                <p className="text-gray-500 text-sm">
                                    {course.fichier.split('/').pop()}
                                </p>
                            </div>
                        </div>
                        
                        <a
                            href={`${process.env.REACT_APP_API_URL}/${course.fichier}`}
                            download
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Télécharger
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Link
                    to={`/chercheurs/${id}/cours/${coursId}/edit`}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Modifier
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Supprimer
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;