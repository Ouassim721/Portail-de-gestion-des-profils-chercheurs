import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import api from '../../axios';

function CoursesGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/chercheurs/${id}/cours`);
      setCourses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours :', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(cours => {
    const matchesSearch = cours.titre.toLowerCase().includes(filter.toLowerCase()) || 
                         cours.description.toLowerCase().includes(filter.toLowerCase());
    const matchesMatiere = selectedMatiere ? cours.id_matiere == selectedMatiere : true;
    return matchesSearch && matchesMatiere;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Cours</h1>
        <button
          onClick={() => navigate(`/chercheurs/${id}/cours/new`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nouveau cours
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par matière</label>
          <select
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les matières</option>
            {[...new Set(courses.map(c => c.matiere))].map(matiere => (
              <option key={matiere.id} value={matiere.id}>{matiere.nom_matiere}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={() => { setFilter(''); setSelectedMatiere(''); }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun cours trouvé</h3>
          <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(cours => (
            <CourseCard 
              key={cours.id} 
              cours={cours} 
              chercheurId={id} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesGrid;