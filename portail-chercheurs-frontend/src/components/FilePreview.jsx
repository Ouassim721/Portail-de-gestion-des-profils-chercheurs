import React from "react";
import { DocumentTextIcon, TrashIcon } from "@heroicons/react/24/solid";

const FilePreview = ({ file, onRemove }) => {
  // Vérification de l'existence du fichier
  if (!file) return null;

  // Formatage robuste de la taille
  const formatFileSize = (bytes) => {
    if (typeof bytes !== "number" || bytes === 0) return "0 KB";

    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
      <div className="flex items-center">
        {/* Icône spécifique aux PDF */}
        <div className="relative">
          <DocumentTextIcon className="w-6 h-6 text-red-500 mr-3" />
        </div>

        <div className="min-w-0">
          <p
            className="text-sm font-medium text-gray-700 truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove()}
        className="text-red-500 hover:text-red-700 transition-colors"
        aria-label={`Supprimer ${file.name}`}
        title="Supprimer le fichier"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FilePreview;
