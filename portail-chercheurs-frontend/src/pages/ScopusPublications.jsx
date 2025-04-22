import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

export default function ScopusPublications() {
  const [pubs, setPubs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get('/scopus-publications');
        
        // Validation des données
        const validPubs = response.data.filter(p => p?.id);
        const invalidPubs = response.data.filter(p => !p?.id);
        
        if (invalidPubs.length > 0) {
          console.warn('Publications invalides:', invalidPubs);
        }

        setPubs(validPubs);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  function toggle(id) {
    if (!id) return; // Bloque les IDs invalides
    setSelected(s => 
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    );
  }

  async function handleImport() {
    try {
      const toImport = pubs
        .filter(p => selected.includes(p.id))
        .map(p => ({
          id: p.id,
          title: p.title,
          authors: p.authors,
          date: p.date,
          citationCount: p.citationCount
        }));

      await axios.post('/publications', { publications: toImport });
      alert(`${toImport.length} publications importées avec succès`);
      navigate('/');
    } catch (err) {
      setError(`Erreur d'import : ${err.response?.data?.message || err.message}`);
    }
  }

  if (loading) {
    return <div className="text-center p-4">Chargement des publications...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600">
        <p>Erreur : {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl mb-4 font-semibold">
        Publications disponibles ({pubs.length})
      </h2>
      
      {pubs.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucune publication trouvée
        </div>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {pubs.map(p => (
              <li 
                key={p.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {p.authors}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="mr-3">
                        📅 {new Date(p.date).toLocaleDateString()}
                      </span>
                      <span>📚 {p.citationCount} citations</span>
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selected.length} sélectionnées
            </div>
            <button
              onClick={handleImport}
              disabled={!selected.length}
              className={`px-4 py-2 rounded-lg ${
                selected.length 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              Importer les publications
            </button>
          </div>
        </>
      )}
    </div>
  );
}