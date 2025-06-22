import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "../../axios";
import TopBar from "../../components/layout/topbar";
import Button from "../../components/ui/Button";
import UpdateModal from "../../components/modals/UpdateModal";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

const AdminActualite = () => {
  const navigate = useNavigate();
  const { t, formatDate } = useContext(LanguageContext);
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
      logError(t("errorLoadingData"), err);
    }
  };

  const supprimerActualite = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    try {
      await axios.delete(`http://localhost:8000/api/actualites/${id}`);
      setActualites(actualites.filter((a) => a.id !== id));
    } catch (err) {
      logError(t("errorDelete"), err);
    }
  };

  const filtrerActualites = () => {
    const now = moment();
    if (filtre === "avenir") {
      return actualites.filter((a) => moment(a.date_publication).isAfter(now));
    } else if (filtre === "archive") {
      return actualites.filter((a) => moment(a.date_publication).isBefore(now));
    }
    return actualites;
  };

  const liste = filtrerActualites();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-secondary)] ">
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {t("adminNewsTitle")}
            </h1>
            <Button
              onClick={() =>
                navigate("creationactualite", { relative: "path" })
              }
              icon={faPlus}
            >
              {t("addButton")}
            </Button>
          </div>

          {/* Filtre */}
          <div className="p-4">
            <select
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              className="mb-4 border p-2 rounded"
            >
              <option value="toutes">{t("filterAll")}</option>
              <option value="avenir">{t("filterFuture")}</option>
              <option value="archive">{t("filterArchive")}</option>
            </select>

            {/* Tableau */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
                <tr className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">
                  <th className="p-2">{t("tableHeaderTitle")}</th>
                  <th className="p-2">{t("tableHeaderLocation")}</th>
                  <th className="p-2">{t("tableHeaderDate")}</th>
                  <th className="p-2">{t("tableHeaderCategory")}</th>
                  <th className="p-2">{t("tableHeaderActions")}</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] divide-y divide-gray-200">
                {liste.map((a) => (
                  <tr key={a.id} className="transition-colors">
                    <td className="p-2">{a.titre}</td>
                    <td className="p-2">{a.localisation}</td>
                    <td className="p-2">
                      {formatDate(a.date_publication, { dateStyle: "short" })}
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
                {liste.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      {t("noNewsFound")}
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
