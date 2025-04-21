import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../components/Loader';

const ScopusPublications = () => {
    const [publications, setPublications] = useState([]);
    const [selectedPublications, setSelectedPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await axios.get('/api/scopus-publications');
                setPublications(response.data);
            } catch (error) {
                console.error('Error fetching Scopus publications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublications();
    }, []);

    const handleCheckboxChange = (pubId) => {
        setSelectedPublications(prev => 
            prev.includes(pubId) 
                ? prev.filter(id => id !== pubId) 
                : [...prev, pubId]
        );
    };

    const handleImport = async () => {
        try {
            await axios.post('/api/publications', {
                publications: selectedPublications
            });
            navigate('/');
        } catch (error) {
            console.error('Error importing publications:', error);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sélectionnez vos publications Scopus
            </h2>
            
            <div className="space-y-4 mb-8">
                {publications.map((pub) => (
                    <div 
                        key={pub.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedPublications.includes(pub.id)}
                                onChange={() => handleCheckboxChange(pub.id)}
                                className="mt-1 h-4 w-4 text-blue-600"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {pub.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {pub.authors}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>📅 {new Date(pub.date).toLocaleDateString()}</span>
                                    <span>📚 {pub.citationCount} citations</span>
                                </div>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    onClick={handleImport}
                    disabled={selectedPublications.length === 0}
                >
                    Importer ({selectedPublications.length}) sélection(s)
                </Button>
                <Button
                    variant="link"
                    onClick={() => navigate('/')}
                >
                    Passer cette étape
                </Button>
            </div>
        </div>
    );
};


export default ScopusPublications;