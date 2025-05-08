import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

function TableGenerique({ columns, data, onRowClick, onSort, sortConfig }) {
  const { t } = useContext(LanguageContext);

  const handleSort = (key, isSortable) => {
    if (!isSortable) return;
    onSort(key);
  };

  return (
    <div className="overflow-x-auto max-w-[100%] md:max-w-[80%] xl:max-w-[75%] mx-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <table className="w-full border-collapse border border-gray-300 text-sm sm:text-md">
        <thead className="">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-left text-gray-700 uppercase font-semibold border-b ${
                  col.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => handleSort(col.key, col.sortable)}
              >
                <div className="flex items-center">
                  {col.label}
                  {sortConfig && sortConfig.key === col.key && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc"
                        ? t("sortAsc")
                        : t("sortDesc")}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(item)}
              className="cursor-pointer hover:bg-[var(--color-bg-primary)] border-b"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 text-[var(--color-text)]"
                >
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableGenerique;