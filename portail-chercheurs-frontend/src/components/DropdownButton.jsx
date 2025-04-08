import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button"; // Importer le composant Button

const DropdownButton = ({
  icon,
  children,
  variant = "primary",
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative inline-block " ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        icon={icon || faChevronDown}
        variant={variant}
      >
        {children}
      </Button>

      {isOpen && (
        <div className="absolute left-0 w-40 bg-white border border-gray-200 rounded shadow-md">
          {options.map((option, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                option.onClick();
                setIsOpen(false); // Fermer le dropdown après clic
              }}
            >
              <FontAwesomeIcon icon={option.icon} className="mr-2" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
