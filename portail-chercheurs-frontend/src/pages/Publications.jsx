import React from 'react';
import { FaFileAlt, FaSearch, FaPlus, FaFilter } from 'react-icons/fa';

const PublicationsPage = () => {
  const publications = [
    {
      id: 1,
      title: "Les nouvelles méthodes d'IA en médecine",
      author: "Dr. Marie Dupont",
      date: "2024-03-15",
      status: "Publié"
    },
    {
      id: 2,
      title: "Optimisation des algorithmes quantiques",
      author: "Prof. Jean Martin",
      date: "2024-03-12",
      status: "En révision"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto p-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des publications</h1>
            <p className="text-gray-500 mt-1">32 publications enregistrées</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2">
            <FaPlus /> Nouvelle publication
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="relative flex-1">
            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            <select className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg">
              <option>Toutes les catégories</option>
              <option>Médecine</option>
              <option>Informatique</option>
            </select>
          </div>
        </div>

        {/* Liste des publications */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Titre</th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Auteur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-gray-400" />
                      {pub.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">{pub.author}</td>
                  <td className="px-6 py-4">{pub.date}</td>
                  <td className="px-6 py-4">
  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
    {pub.status}
  </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700">Éditer</button>
                    <button className="text-red-600 hover:text-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PublicationsPage;