import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

export default function SelectScopusProfile() {
    const [authors, setAuthors] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/scopus/authors')
            .then(({ data }) => {
                setAuthors(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Erreur de recherche');
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/scopus/link-author', { author_id: selectedId });
            navigate('/scopus-publications');
        } catch (err) {
            setError('Échec de la liaison du profil');
        }
    };

    if (loading) return <div className="p-4">Recherche des profils Scopus...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl mb-6">Sélectionnez votre profil Scopus</h1>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                    {authors.map(author => (
                        <label 
                            key={author.id}
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="scopus_author"
                                value={author.id}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="h-4 w-4 text-blue-600"
                            />
                            <div className="ml-3">
                                <p className="font-semibold">{author.name}</p>
                                <p className="text-sm text-gray-600">
                                    {author.affiliation} • {author.documents} publications
                                </p>
                            </div>
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={!selectedId}
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    Confirmer la sélection
                </button>
            </form>
        </div>
    );
}