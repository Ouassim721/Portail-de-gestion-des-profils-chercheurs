import { useState, useRef, useEffect } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DropdownScroll({ label, options, selectedLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleToggle = () => setIsOpen(!isOpen);
  const handleOptionClick = (callback) => {
    callback();
    setIsOpen(false);
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200"
      >
        <span>{selectedLabel || label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-md">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt.onClick)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownScroll;
