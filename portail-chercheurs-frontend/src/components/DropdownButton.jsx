import { useState } from "react";
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

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        icon={icon || faChevronDown} // Icône par défaut (flèche vers le bas)
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
