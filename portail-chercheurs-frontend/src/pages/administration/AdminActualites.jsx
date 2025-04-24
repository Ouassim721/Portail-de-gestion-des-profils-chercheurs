import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "../../axios";
import TopBar from "../../components/layout/topbar";
import Button from "../../components/ui/Button";
import UpdateModal from "../../components/modals/UpdateModal";

const AdminActualite = () => {
  const navigate = useNavigate();
  const [actualites, setActualites] = useState([]);
  const [filtre, setFiltre] = useState("toutes");
  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/actualites");
      setActualites(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  const supprimerActualite = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/actualites/${id}`);
      setActualites(actualites.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const filtrerActualites = () => {
    const maintenant = moment();

    if (filtre === "avenir") {
      return actualites.filter((a) =>
        moment(a.date_publication).isAfter(maintenant)
      );
    } else if (filtre === "archive") {
      return actualites.filter((a) =>
        moment(a.date_publication).isBefore(maintenant)
      );
    }

    return actualites;
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestion des Actualités
            </h1>
            <div className="flex gap-4 w-full md:w-auto">
              <Button
                onClick={() =>
                  navigate("creationactualite", { relative: "path" })
                }
                icon={faPlus}
              >
                Ajouter
              </Button>
            </div>
          </div>
          <div className="p-4">
            <select
              onChange={(e) => setFiltre(e.target.value)}
              className="mb-4 border p-2 rounded"
            >
              <option value="toutes">Toutes</option>
              <option value="avenir">À venir</option>
              <option value="archive">Archivées</option>
            </select>

            <table className="w-full border text-left shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Titre</th>
                  <th className="p-2">Localisation</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Catégorie</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtrerActualites().map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{a.titre}</td>
                    <td className="p-2">{a.localisation}</td>
                    <td className="p-2">
                      {moment(a.date_publication).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-2">{a.categorie}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => supprimerActualite(a.id)}
                        className="text-red-500 px-2 py-1 rounded text-xl"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                      <UpdateModal actualite={a} onUpdate={fetchActualites} />
                    </td>
                  </tr>
                ))}
                {filtrerActualites().length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Aucune actualité trouvée.
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

export default AdminActualite;
