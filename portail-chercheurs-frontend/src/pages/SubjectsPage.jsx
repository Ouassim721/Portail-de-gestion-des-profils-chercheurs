import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';
import SubjectForm from '../components/matieres/SubjectForm';
import SubjectList from '../components/matieres/SubjectList';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import useAuth from '../hooks/useAuth';

const SubjectsPage = () => {
    const { user } = useAuth(); // Utilisez directement "user" de notre contexte
    const id = user?.id; // ID du chercheur connecté
    const [subjects, setSubjects] = useState([]); // Matières du chercheur
    const [allSubjects, setAllSubjects] = useState([]); // Toutes les matières (pour le formulaire d'ajout)
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

            // Log pour débogage
            console.log("Matières du chercheur:", researcherResponse.data);
            console.log("Toutes les matières:", allResponse.data);

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
        // Envoyer l'ID de matière dans le format attendu par l'API
        const response = await api.post(`/chercheurs/${id}/matieres`, {
            id_matiere: subjectId
        });
        
        // Ajouter la nouvelle matière à la liste actuelle
        setSubjects(prevSubjects => [
            ...prevSubjects,
            {
                id_matiere: subjectId,
                nom_matiere: response.data.nom_matiere
            }
        ]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la matière :', error);
        
        // Afficher un message d'erreur spécifique si disponible
        if (error.response && error.response.data && error.response.data.message) {
            alert(`Erreur: ${error.response.data.message}`);
        } else {
            alert('Une erreur est survenue lors de l\'ajout de la matière');
        }
    }
};

const handleDetach = async (subjectId) => {
    try {
        await api.delete(`/chercheurs/${id}/matieres/${subjectId}`);
        
        // Mise à jour optimiste de l'état local
        setSubjects(prevSubjects => 
            prevSubjects.filter(s => s.id_matiere !== subjectId)
        );
    } catch (error) {
        console.error('Erreur lors de la suppression de la matière :', error);
        
        // Recharger les données depuis le serveur en cas d'erreur
        try {
            const response = await api.get(`/chercheurs/${id}/matieres`);
            setSubjects(response.data);
        } catch (refreshError) {
            console.error('Erreur de rechargement des matières:', refreshError);
        }
        
        // Afficher un message d'erreur
        if (error.response && error.response.data && error.response.data.message) {
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Annuler
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
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