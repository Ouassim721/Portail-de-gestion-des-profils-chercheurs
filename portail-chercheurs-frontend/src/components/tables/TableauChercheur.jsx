import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TableGenerique2 from "./TableGenerique2";
import { faPlus, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../ui/Button";
import axios from "../../axios";
import Loader from "../ui/Loader";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

export default function ChercheursList() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const [researchers, setResearchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchResearchers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `/chercheurs?page=${currentPage}&archived=${showArchived}`
      );
      if (!res.data?.data || res.data.last_page == null) {
        throw new Error("Unexpected response structure");
      }
      setTotalPages(res.data.last_page);
      const formatted = res.data.data.map((c) => ({
        id: c.id,
        prenom: c.prenom,
        nom: c.nom,
        name: `${c.prenom} ${c.nom}`,
        email: c.email,
        specialisation: c.specialisation || t("notSpecified"),
        archived: c.deleted_at !== null,
      }));
      setResearchers(formatted);
    } catch (err) {
      logError(t("loadResearchersError"), err);
      setError(t("loadResearchersError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, [currentPage, t, showArchived]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const deleteResearcher = async (id, isArchived) => {
    const message = isArchived
      ? t("confirmPermanentDeleteResearcher")
      : t("confirmArchiveResearcher");

    if (!window.confirm(message)) return;

    try {
      await axios.delete(`/chercheurs/${id}`);
      await fetchResearchers(); // Recharger les données après suppression
    } catch (err) {
      logError(t("deleteResearcherError"), err);
      alert(t("deleteResearcherError"));
    }
  };

  const restoreResearcher = async (id) => {
    if (!window.confirm(t("confirmRestoreResearcher"))) return;

    try {
      await axios.put(`/chercheurs/${id}/restore`);
      await fetchResearchers(); // Recharger les données après restauration
    } catch (err) {
      logError(t("restoreError"), err);
      alert(t("restoreError"));
    }
  };

  const filteredData = researchers
    .filter((r) =>
      [r.name, r.email, r.specialisation].some(
        (field) => field && field.toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const av = a[sortConfig.key] || "";
      const bv = b[sortConfig.key] || "";
      if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  if (isLoading) return <Loader className="text-center py-8" />;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-6 container mx-auto lg:p-6 bg-[var(--color-bg-secondary)]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {t("manageResearchers")}
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder={t("searchResearchersPlaceholder")}
            className="border px-4 py-2 rounded-lg flex-grow md:w-64 text-[var(--color-text-secondary)]"
            onChange={handleSearch}
            value={searchTerm}
          />

          <Button
            onClick={() => navigate("creationchercheur")}
            icon={faPlus}
            aria-label={t("addResearcher")}
          >
            {t("add")}
          </Button>
        </div>
      </div>
      <div>
        <select
          className="border px-4 py-2 rounded-lg"
          value={showArchived}
          onChange={(e) => setShowArchived(e.target.value === "true")}
        >
          <option value="false">{t("active")}</option>
          <option value="true">{t("archived")}</option>
        </select>
      </div>

      <TableGenerique2
        data={filteredData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        deleteResearcher={deleteResearcher}
        restoreResearcher={restoreResearcher}
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
