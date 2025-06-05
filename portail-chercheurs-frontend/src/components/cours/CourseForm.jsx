import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios';

function CourseForm() {
  const { id, coursId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(coursId);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    datePublication: new Date().toISOString().split('T')[0],
    id_matiere: '',
    fichier: null
  });
  const [existingFile, setExistingFile] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMatieres();
    if (isEdit) {
      fetchCours();
    }
  }, []);

  const fetchMatieres = async () => {
    try {
      const response = await api.get(`/chercheurs/${id}/matieres`);
      setMatieres(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières :', error);
    }
  };

  const fetchCours = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cours/${coursId}`);
      const coursData = response.data;
      setFormData({
        titre: coursData.titre,
        description: coursData.description,
        datePublication: coursData.datePublication.split('T')[0],
        id_matiere: coursData.id_matiere,
        fichier: null
      });
      setExistingFile(coursData.fichier);
    } catch (error) {
      console.error('Erreur lors de la récupération du cours :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, fichier: e.target.files[0] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titre) newErrors.titre = 'Le titre est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.id_matiere) newErrors.id_matiere = 'Veuillez sélectionner une matière';
    if (!isEdit && !formData.fichier) newErrors.fichier = 'Un fichier est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('titre', formData.titre);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('datePublication', formData.datePublication);
    formDataToSend.append('id_matiere', formData.id_matiere);
    if (formData.fichier) {
      formDataToSend.append('fichier', formData.fichier);
    }

    try {
      if (isEdit) {
        await api.put(
          `/chercheurs/${id}/cours/${coursId}`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await api.post(
          `/chercheurs/${id}/cours`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
      navigate(`/chercheurs/${id}/cours`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement :', error);
      setErrors({ submit: 'Une erreur est survenue lors de l\'enregistrement' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Modifier le cours' : 'Nouveau cours'}
      </h1>
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Titre *</label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${errors.titre ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          />
          {errors.titre && <p className="mt-1 text-red-500 text-sm">{errors.titre}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          />
          {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date de publication</label>
          <input
            type="date"
            name="datePublication"
            value={formData.datePublication}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Matière *</label>
          <select
            name="id_matiere"
            value={formData.id_matiere}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${errors.id_matiere ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading || matieres.length === 0}
          >
            <option value="">-- Sélectionner une matière --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>{m.nom_matiere}</option>
            ))}
          </select>
          {errors.id_matiere && <p className="mt-1 text-red-500 text-sm">{errors.id_matiere}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Fichier {isEdit ? '(Laisser vide pour conserver le fichier actuel)' : '*'}
          </label>
          
          {isEdit && existingFile && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Fichier actuel: {existingFile}</p>
            </div>
          )}
          
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
            className={`w-full ${errors.fichier ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.fichier && <p className="mt-1 text-red-500 text-sm">{errors.fichier}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/chercheurs/${id}/cours`)}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Mise à jour...' : 'Création...'}
              </span>
            ) : isEdit ? 'Mettre à jour' : 'Créer le cours'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;