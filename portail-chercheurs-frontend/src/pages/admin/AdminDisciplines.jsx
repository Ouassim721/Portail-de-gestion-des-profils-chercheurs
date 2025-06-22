import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../axios";
import TopBar from "../../components/layout/topbar";
import { LanguageContext } from "../../contexts/LanguageContext";
import { log } from "@/utils/logger";
import { logError } from "@/utils/logger";

const AdminDiscipline = () => {
  const { t, formatDate } = useContext(LanguageContext);
  const [disciplines, setDisciplines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "nom",
    direction: "asc",
  });
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState("");

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/disciplines");
      setDisciplines(res.data);
      log(disciplines);
    } catch (err) {
      logError(t("errorLoadingData"), err);
    }
  };

  const supprimerDiscipline = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    try {
      await axios.delete(`http://localhost:8000/api/disciplines/${id}`);
      setDisciplines(disciplines.filter((a) => a.id !== id));
    } catch (err) {
      logError(t("errorDelete"), err);
    }
  };

  const handleEdit = (discipline) => {
    setEditingId(discipline.id);
    setEditValue(discipline.nom);
  };

  const handleSave = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/disciplines/${id}`, {
        nom: editValue,
      });
      setDisciplines(
        disciplines.map((item) =>
          item.id === id
            ? {
                ...item,
                nom: editValue,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      logError(t("errorUpdate"), err);
    }
  };

  const handleAddDiscipline = async () => {
    if (!newDiscipline.trim()) {
      setIsAdding(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/disciplines", {
        nom: newDiscipline,
      });
      setDisciplines([...disciplines, res.data]);
      setNewDiscipline("");
      setIsAdding(false);
    } catch (err) {
      logError(t("errorAddDiscipline"), err);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };

  const sortedAndFilteredDisciplines = React.useMemo(() => {
    let filtered = [...disciplines];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [disciplines, searchTerm, sortConfig]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-secondary)]">
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {t("adminDisciplineTitle")}
            </h1>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              {t("addButton")}
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("nom")}
                  >
                    <div className="flex items-center">
                      {t("tableHeaderName")}
                      <FontAwesomeIcon
                        icon={getSortIcon("nom")}
                        className="ml-2 text-xs"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center">
                      {t("creationDate")}
                      <FontAwesomeIcon
                        icon={getSortIcon("created_at")}
                        className="ml-2 text-xs"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("updated_at")}
                  >
                    <div className="flex items-center">
                      {t("modificationDate")}
                      <FontAwesomeIcon
                        icon={getSortIcon("updated_at")}
                        className="ml-2 text-xs"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("tableHeaderActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Ligne d'ajout */}
                {isAdding && (
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newDiscipline}
                          onChange={(e) => setNewDiscipline(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddDiscipline();
                            if (e.key === "Escape") setIsAdding(false);
                          }}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t("new")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t("new")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={handleAddDiscipline}
                        className="text-green-600 hover:text-green-800 mr-2"
                        title={t("save")}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-red-600 hover:text-red-800"
                        title={t("cancel")}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                )}

                {sortedAndFilteredDisciplines.map((discipline) => (
                  <tr key={discipline.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === discipline.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleSave(discipline.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(discipline.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                          onClick={() => handleEdit(discipline)}
                        >
                          {discipline.nom}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(discipline.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(discipline.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === discipline.id ? (
                        <>
                          <button
                            onClick={() => handleSave(discipline.id)}
                            className="text-green-600 hover:text-green-800 mr-2"
                            title={t("save")}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:text-red-800"
                            title={t("cancel")}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => supprimerDiscipline(discipline.id)}
                          className="text-red-600 hover:text-red-900"
                          title={t("delete")}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {sortedAndFilteredDisciplines.length === 0 && !isAdding && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {t("noDisciplinesFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDiscipline;
