import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DropdownMenu = ({ children, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div className="" onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      {isOpen && (
        <div className="absolute right-0 w-60 text-sm text-[var(--color-text-primary)] bg-[var(--color-white)] border border-gray-200 rounded shadow-md">
          <div className="h-[1px] w-full bg-gray-300 my-2"></div>
          {options.map((option, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon icon={option.icon} className="mr-2" />
              {option.label}
            </button>
          ))}
          <div className="h-[1px] w-full bg-gray-300 my-2"></div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
