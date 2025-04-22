import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Button from '../components/Button';

const ProfileCompletion = () => {
    const [form, setForm] = useState({
        discipline: '',
        cv: null,
        photoProfil: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData();
            if (form.discipline) formData.append('discipline', form.discipline);
            if (form.cv) formData.append('cv', form.cv);
            if (form.photoProfil) formData.append('photoProfil', form.photoProfil);

            await axios.put('/api/chercheur/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/select-scopus-profile');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Complétez votre profil
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discipline de recherche *
                    </label>
                    <input
                        type="text"
                        name="discipline"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setForm({...form, discipline: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV (PDF uniquement)
                    </label>
                    <input
                        type="file"
                        name="cv"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo de profil
                    </label>
                    <input
                        type="file"
                        name="photoProfil"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        className="w-1/2"
                        disabled={loading}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-1/2"
                        onClick={() => navigate('/select-scopus-profile')}
                    >
                        Passer cette étape
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileCompletion;