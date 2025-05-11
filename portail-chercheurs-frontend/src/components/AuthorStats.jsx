import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios'; // Import de votre instance existante
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AuthorStats = () => {
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAuthorStats = async () => {
    try {
      const response = await axiosInstance.get('/stats/authors');
      setAuthorData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      setLoading(false);
    }
  };

  fetchAuthorStats();
}, []);

  if (loading) return <div className="p-4 text-gray-500">Chargement des statistiques...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Statistiques des Auteurs</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top 10 des auteurs les plus publiés
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={authorData}>
                <XAxis 
                  dataKey="author" 
                  angle={-45} 
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Détail des publications par auteur
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Auteur</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Nombre de publications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {authorData.map(({ author, count }, index) => (
                  <tr key={author} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{author}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorStats;