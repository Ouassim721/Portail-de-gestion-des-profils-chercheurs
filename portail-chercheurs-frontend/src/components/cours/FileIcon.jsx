import React from 'react';

const FileIcon = ({ filename }) => {
    if (!filename) return null;
    
    const extension = filename.split('.').pop().toLowerCase();
    let icon, color;
    
    switch (extension) {
        case 'pdf':
            icon = '📄';
            color = 'text-red-500';
            break;
        case 'doc':
        case 'docx':
            icon = '📝';
            color = 'text-blue-500';
            break;
        case 'ppt':
        case 'pptx':
            icon = '📊';
            color = 'text-orange-500';
            break;
        default:
            icon = '📁';
            color = 'text-gray-500';
    }
    
    return (
        <span className={`text-xl ${color}`}>
            {icon}
        </span>
    );
};

export default FileIcon;