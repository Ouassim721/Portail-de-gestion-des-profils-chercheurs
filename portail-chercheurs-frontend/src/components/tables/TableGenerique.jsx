function TableGenerique({ columns, data, onRowClick, onSort, sortConfig }) {
  const handleSort = (key, isSortable) => {
    if (!isSortable) return;
    onSort(key);
  };

  return (
<<<<<<< HEAD
    <div className="overflow-x-auto max-w-[100%] md:max-w-[80%] xl:max-w-[75%] mx-auto bg-[var(--color-bg-secondary)]">
      <table className="w-full border-collapse border border-gray-300 text-sm sm:text-md">
        <thead className="bg-red-600 ">
=======
    <div className="overflow-x-auto max-w-[100%] md:max-w-[80%] xl:max-w-[75%] mx-auto">
      <table className="w-full border-collapse border border-[var(--color-border)] text-sm sm:text-md">
        <thead className="bg-[var(--color-table-header-bg)]">
>>>>>>> badreddine
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
<<<<<<< HEAD
                className={`px-4 py-2 text-left text-gray-700 uppercase font-semibold border-b  ${
                  col.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => handleSort(col.key, col.sortable)}
=======
                className="px-4 py-2 text-left text-[var(--color-text-secondary)] uppercase font-semibold border-b border-[var(--color-border)]"
>>>>>>> badreddine
              >
                <div className="flex items-center">
                  {col.label}
                  {sortConfig && sortConfig.key === col.key && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
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
<<<<<<< HEAD
              className="cursor-pointer hover:bg-[var(--color-bg-primary)] border-b"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 text-[var(--color-text-secondary)]"
                >
                  {col.render ? col.render(item) : item[col.key]}
=======
              className="cursor-pointer hover:bg-[var(--color-hover-bg)] border-b border-[var(--color-border)]"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-[var(--color-text)]">
                  {item[col.key]}
>>>>>>> badreddine
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
