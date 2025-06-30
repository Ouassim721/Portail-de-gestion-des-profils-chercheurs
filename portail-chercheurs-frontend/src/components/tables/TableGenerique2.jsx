import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import ChercheurAvatar from "../ui/ChercheurAvatar";

const TableGenerique2 = ({
  data,
  sortConfig,
  setSortConfig,
  deleteResearcher,
  restoreResearcher,
}) => {
  const columns = [
    { key: "name", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "specialisation", label: "Spécialisation" },
    { label: "Actions" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
          <tr>
            {columns.map((header) => (
              <th
                key={header.key || header.label}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
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

        <tbody className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] divide-y divide-gray-200">
          {data.map((researcher) => (
            <tr
              key={researcher.id}
              className={`transition-colors ${
                researcher.archived ? "opacity-70" : ""
              }`}
            >
              <td className="px-4 py-3 flex items-center gap-3">
                <ChercheurAvatar
                  chercheur={researcher}
                  size="md"
                  className="w-6 mx-auto sm:mx-0"
                />
                <span className="font-medium">{researcher.name}</span>
              </td>
              <td className="px-4 py-3">{researcher.email}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {researcher.specialisation}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-3">
                {researcher.archived && (
                  <button
                    className="text-green-600 hover:text-green-800 transition-colors"
                    onClick={() => restoreResearcher(researcher.id)}
                    title="Restaurer"
                  >
                    <FontAwesomeIcon
                      icon={faTrashRestore}
                      className="w-5 h-5"
                    />
                  </button>
                )}
                <button
                  className="text-red-600 hover:text-red-800 transition-colors"
                  onClick={() =>
                    deleteResearcher(researcher.id, researcher.archived)
                  }
                  title={
                    researcher.archived
                      ? "Supprimer définitivement"
                      : "Archiver"
                  }
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

export default TableGenerique2;
