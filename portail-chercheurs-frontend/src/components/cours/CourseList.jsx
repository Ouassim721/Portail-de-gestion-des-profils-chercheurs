import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios';
import CourseCard from './CourseCard';
import FiltersBar from './FiltersBar';

const CourseList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(`/chercheurs/${id}/cours`);
                setCourses(response.data);
            } catch (error) {
                console.error('Erreur de chargement des cours :', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [id]);

    const handleDelete = async (courseId) => {
        if (window.confirm('Supprimer ce cours définitivement ?')) {
            try {
                await api.delete(`/chercheurs/${id}/cours/${courseId}`);
                setCourses(courses.filter(c => c.id !== courseId));
            } catch (error) {
                console.error('Erreur de suppression :', error);
            }
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch =
            course.titre.toLowerCase().includes(filter.toLowerCase()) ||
            course.description.toLowerCase().includes(filter.toLowerCase());
        const matchesSubject = selectedSubject
            ? (course.matiere.id == selectedSubject)
            : true;
        return matchesSearch && matchesSubject;
    });

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mes Cours</h1>
                <button
                    onClick={() => navigate(`/chercheurs/${id}/cours/new`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nouveau cours
                </button>
            </div>

            <FiltersBar
                filter={filter}
                setFilter={setFilter}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                courses={courses}
            />

            {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="mt-4 text-xl font-medium text-gray-900">Aucun cours trouvé</h3>
                    <p className="mt-2 text-gray-500">Essayez de modifier vos filtres ou créez un nouveau cours</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            researcherId={id}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;
