import React, { useContext } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { LanguageContext } from "../../contexts/LanguageContext";

const TableGenerique = ({
  data,
  selectedRows,
  setSelectedRows,
  sortConfig,
  setSortConfig,
  deleteResearcher,
}) => {
  const { t } = useContext(LanguageContext);

  const columns = [
    { key: "name", label: t("tableHeaderName") },
    { key: "email", label: t("tableHeaderEmail") },
    { key: "domain", label: t("tableHeaderDomain") },
    { key: "status", label: t("tableHeaderStatus") },
    { label: t("tableHeaderActions") },
  ];

  const handleSelectAll = (e) => {
    const newSelected = e.target.checked
      ? new Set(data.map((r) => r.id))
      : new Set();
    setSelectedRows(newSelected);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                aria-label={t("selectAll")}
                onChange={handleSelectAll}
                checked={selectedRows.size === data.length}
              />
            </th>
            {columns.map((header) => (
              <th
                key={header.key || header.label}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() =>
                  header.key &&
                  setSortConfig({
                    key: header.key,
                    direction: sortConfig.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  {header.key && (
                    <span className="text-gray-400">
                      {sortConfig.key === header.key &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
<<<<<<< HEAD

        <tbody className="bg-[var(--color-bg-primary)] divide-y divide-gray-200">
=======
        <tbody className="bg-white divide-y divide-gray-200">
>>>>>>> badreddine
          {data.map((researcher) => (
            <tr
              key={researcher.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label={t("selectRow", { name: researcher.name })}
                  checked={selectedRows.has(researcher.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedRows);
                    e.target.checked
                      ? newSelected.add(researcher.id)
                      : newSelected.delete(researcher.id);
                    setSelectedRows(newSelected);
                  }}
                />
              </td>
              <td className="px-4 py-3 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={researcher.avatar}
                    alt={t("avatarAlt", { name: researcher.name })}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-0 -right-0 w-3 h-3 rounded-full 
                    ${
                      researcher.status === t("statusOnline")
                        ? "bg-green-500"
                        : "bg-gray-400"
                    } 
                    border-2 border-white`}
                  />
                </div>
                <span className="font-medium">{researcher.name}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{researcher.email}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {researcher.domain}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${
                    researcher.status === t("statusOnline")
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {researcher.status}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-3">
                <button
                  aria-label={t("editAction", { name: researcher.name })}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                  aria-label={t("deleteAction", { name: researcher.name })}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  onClick={() => deleteResearcher(researcher.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableGenerique;
