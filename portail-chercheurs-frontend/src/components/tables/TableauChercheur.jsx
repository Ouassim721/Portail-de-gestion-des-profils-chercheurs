import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TableGenerique2 from "./TableGenerique2";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import axios from "../../axios";

export default function ChercheursList() {
  const navigate = useNavigate();
  const [researchers, setChercheurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        const res = await axios.get(`/chercheurs?page=${currentPage}`);

        // Update the total researchers and pages
        setTotalPages(res.data.last_page);

        // Format data for display
        const formatted = res.data.data.map((c) => ({
          id: c.id,
          name: `${c.prenom} ${c.nom}`,
          email: c.email,
          domain: c.discipline,
          status: "Online",
        }));

        setChercheurs(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des chercheurs :", error);
      }
    };

    fetchChercheurs();
  }, [currentPage]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const deleteChercheur = async (id) => {
    // Demander confirmation à l'admin
    if (window.confirm("Supprimer ce chercheur ?")) {
      try {
        // Envoi de la requête DELETE pour supprimer le chercheur du backend
        await axios.delete(`/chercheurs/${id}`);

        // Mise à jour de l'état local pour supprimer le chercheur de la liste
        setChercheurs((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression du chercheur :", error);
        alert("Une erreur est survenue lors de la suppression du chercheur.");
      }
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
          <Button
            onClick={() => navigate("CreationChercheur", { relative: "path" })}
            icon={faPlus}
          >
            Ajouter
          </Button>
        </div>
      </div>

      <TableGenerique2
        data={filteredData} // Utiliser filteredData qui est déjà filtré et trié
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        deleteChercheur={deleteChercheur}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
