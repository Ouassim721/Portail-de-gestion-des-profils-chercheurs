import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../axios';
import { 
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/solid';

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
                const response = await api.get(`/chercheurs/${id}/cours/${coursId}`);
                setCourse(response.data);
            } catch (err) {
                setError('Erreur lors du chargement du cours');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourse();
    }, [id, coursId]);

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
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
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
                            <DocumentTextIcon className="w-6 h-6 text-red-500" />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Fichier attaché</h3>
                                <p className="text-gray-500 text-sm">
                                    {course.fichier.split('/').pop()}
                                </p>
                            </div>
                        </div>
                        
                        <a
                            href={`${import.meta.env.VITE_API_URL}/${course.fichier}`}
                            download
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
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
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Modifier
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Supprimer
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;