import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TableGenerique2 from "./TableGenerique2";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import axios from "../../axios";

export default function ChercheursList() {
  const navigate = useNavigate();
  const [researchers, setResearchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/chercheurs?page=${currentPage}`);

        // Vérification de la structure de la réponse
        if (!res.data || !res.data.data || !res.data.last_page) {
          throw new Error("Structure de réponse inattendue");
        }

        setTotalPages(res.data.last_page);

        // Format data for display
        const formatted = res.data.data.map((c) => ({
          id: c.id,
          name: `${c.prenom} ${c.nom}`,
          email: c.email,
          domain: c.discipline || "Non spécifié", // Valeur par défaut
          status: "Online", // Peut être dynamique si disponible dans les données
        }));

        setResearchers(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des chercheurs :", error);
        setError("Erreur lors du chargement des chercheurs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearchers();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  };
  const deleteResearcher = async (id) => {
    if (window.confirm("Supprimer ce chercheur ?")) {
      try {
        await axios.delete(`/chercheurs/${id}`);

        // Calculer la nouvelle liste avant de mettre à jour l'état
        const updatedResearchers = researchers.filter((r) => r.id !== id);
        setResearchers(updatedResearchers);

        if (updatedResearchers.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Échec de la suppression. Veuillez réessayer.");
      }
    }
  };

  const filteredData = researchers
    .filter((r) => {
      const term = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(term) ||
        (r.email && r.email.toLowerCase().includes(term)) ||
        (r.domain && r.domain.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  if (isLoading) return <div className="text-center py-8">Chargement...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Chercheurs
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou domaine..."
            className="px-4 py-2 border rounded-lg flex-grow md:w-64"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Button
            onClick={() => navigate("creation-chercheur")}
            icon={faPlus}
            aria-label="Ajouter un chercheur"
          >
            Ajouter
          </Button>
        </div>
      </div>

      <TableGenerique2
        data={filteredData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        deleteResearcher={deleteResearcher}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
