import React, { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({ 
    options, 
    value, 
    onChange, 
    getOptionLabel = option => option, 
    placeholder = "Rechercher..." 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    
    const filteredOptions = options.filter(option =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div 
                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? (
                    <span>{getOptionLabel(value)}</span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
            
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-300 max-h-60 overflow-auto">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    <ul className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.id}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                        value?.id === option.id ? 'bg-blue-100' : ''
                                    }`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {getOptionLabel(option)}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 italic">
                                Aucun résultat trouvé
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;