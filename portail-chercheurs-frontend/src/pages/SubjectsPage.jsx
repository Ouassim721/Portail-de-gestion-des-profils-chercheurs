import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';
import SubjectForm from '../components/matieres/SubjectForm';
import SubjectList from '../components/matieres/SubjectList';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import useAuth from '../hooks/useAuth';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';

const SubjectsPage = () => {
    const { user } = useAuth();
    const id = user?.id;
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { 
        const fetchData = async () => {
            try {
                setLoading(true);
                const [researcherResponse, allResponse] = await Promise.all([
                    api.get(`/chercheurs/${id}/matieres`),
                    api.get('/matieres')
                ]);

                setSubjects(researcherResponse.data);
                setAllSubjects(allResponse.data);
            } catch (error) {
                console.error('Erreur de chargement des matières:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAttach = async (subjectId) => {
        try {
            const response = await api.post(`/chercheurs/${id}/matieres`, {
                id_matiere: subjectId
            });
            
            setSubjects(prevSubjects => [
                ...prevSubjects,
                {
                    id_matiere: subjectId,
                    nom_matiere: response.data.nom_matiere
                }
            ]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la matière :', error);
            if (error.response?.data?.message) {
                alert(`Erreur: ${error.response.data.message}`);
            } else {
                alert('Une erreur est survenue lors de l\'ajout de la matière');
            }
        }
    };

    const handleDetach = async (subjectId) => {
        try {
            await api.delete(`/chercheurs/${id}/matieres/${subjectId}`);
            setSubjects(prevSubjects => 
                prevSubjects.filter(s => s.id_matiere !== subjectId)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de la matière :', error);
            try {
                const response = await api.get(`/chercheurs/${id}/matieres`);
                setSubjects(response.data);
            } catch (refreshError) {
                console.error('Erreur de rechargement des matières:', refreshError);
            }
            
            if (error.response?.data?.message) {
                alert(`Erreur: ${error.response.data.message}`);
            } else {
                alert('Une erreur est survenue lors de la suppression de la matière');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Mes Matières</h1>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className={`px-4 py-2 rounded-lg flex items-center ${
                                showForm 
                                    ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {showForm ? (
                                <>
                                    <XMarkIcon className="h-5 w-5 mr-2" />
                                    Annuler
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Ajouter une matière
                                </>
                            )}
                        </button>
                    </div>

                    {showForm && (
                        <SubjectForm 
                            allSubjects={allSubjects} 
                            currentSubjects={subjects}
                            onAttach={handleAttach}
                        />
                    )}

                    <SubjectList 
                        subjects={subjects} 
                        onDetach={handleDetach}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default SubjectsPage;