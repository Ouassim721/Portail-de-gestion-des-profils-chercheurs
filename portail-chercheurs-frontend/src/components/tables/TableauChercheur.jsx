import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import TableGenerique2 from "./TableGenerique2";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import axios from "../../axios";
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

  useEffect(() => {
    const fetchResearchers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/chercheurs?page=${currentPage}`);
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
          domain: c.discipline || t("notSpecified"),
          status: t("statusOnline"),
        }));
        setResearchers(formatted);
      } catch (err) {
        logError(t("loadResearchersError"), err);
        setError(t("loadResearchersError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchResearchers();
  }, [currentPage, t]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const deleteResearcher = async (id) => {
    if (!window.confirm(t("confirmDeleteResearcher"))) return;
    try {
      await axios.delete(`/chercheurs/${id}`);
      const updated = researchers.filter((r) => r.id !== id);
      setResearchers(updated);
      if (updated.length === 0 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err) {
      logError(t("deleteResearcherError"), err);
      alert(t("deleteResearcherError"));
    }
  };

  const filteredData = researchers
    .filter((r) =>
      [r.name, r.email || "", r.domain || ""].some((field) =>
        field.toLowerCase().includes(searchTerm)
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

  if (isLoading) return <div className="text-center py-8">{t("loading")}</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div
      className="container mx-auto lg:p-6"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("manageResearchers")}
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder={t("searchResearchersPlaceholder")}
            className="text-[var(--color-text-secondary)] border px-4 py-2 rounded-lg flex-grow md:w-64"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Button
            onClick={() => navigate("creationchercheur")}
            icon={faPlus}
            aria-label={t("addResearcher")}
          >
            {t("addResearcher")}
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
