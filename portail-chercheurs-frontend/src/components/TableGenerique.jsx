import React from "react";

function TableGenerique({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto max-w-[100%] md:max-w-[80%] xl:max-w-[75%] mx-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm sm:text-md">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-gray-700 uppercase font-semibold border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(item)}
              className="cursor-pointer hover:bg-gray-100 border-b"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-gray-600">
                  {item[col.key]}
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
