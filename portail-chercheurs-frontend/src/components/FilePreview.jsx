import React from 'react';

const FilePreview = ({ file, onRemove }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      xls: '📊',
      xlsx: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️'
    };
    return iconMap[ext] || '📁';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{getFileIcon(file.name)}</span>
        <div>
          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => onRemove()}
        className="text-red-500 hover:text-red-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default FilePreview;