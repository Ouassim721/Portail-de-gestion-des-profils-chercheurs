import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import TableGenerique2 from "./TableGenerique2";

const initialResearchers = [
  {
    id: 1,
    name: "Lindsey Stroud",
    email: "lindsey.stroud@gmail.com",
    domain: "Science mathématique informatique",
    status: "Online",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    name: "Sarah Brown",
    email: "sarah.brown@gmail.com",
    domain: "Science mathématique informatique",
    status: "Online",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    name: "Micheal Owen",
    email: "michael.owen@gmail.com",
    domain: "Science mathématique informatique",
    status: "Offline",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    name: "Mary Jane",
    email: "mary.jane@gmail.com",
    domain: "Intelligence Artificielle",
    status: "Offline",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 5,
    name: "Garry Lineker",
    email: "garry.lineker@gmail.com",
    domain: "Intelligence Artificielle",
    status: "Online",
    avatar: "https://via.placeholder.com/40",
  },
];

export default function ResearchersList() {
  const navigate = useNavigate();
  const [researchers, setResearchers] = useState(initialResearchers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const deleteResearcher = (id) => {
    if (window.confirm("Supprimer ce chercheur ?")) {
      setResearchers((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filteredData = researchers
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm) ||
        r.email.toLowerCase().includes(searchTerm) ||
        r.domain.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Chercheurs
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-4 py-2 border rounded-lg flex-grow"
            onChange={handleSearch}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => navigate("/CreationChercheur")}
          >
            Ajouter
          </button>
        </div>
      </div>

      <TableGenerique2
        data={currentItems}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        deleteResearcher={deleteResearcher}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}