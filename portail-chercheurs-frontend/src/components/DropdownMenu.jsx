import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DropdownMenu = ({ children, options = [] }) => {
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
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 w-60 text-sm bg-white border border-gray-200 rounded shadow-md"
          role="menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="h-[1px] w-full bg-gray-300 my-2"></div>
          {options.map((option, index) => (
            <div
              key={index}
              className="w-full px-4 py-2 hover:bg-blue-100 hover:text-blue-600 cursor-pointer flex items-center gap-2"
              onClick={() => {
                if (!option.link && option.onClick) option.onClick();
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon icon={option.icon} className="text-gray-600" />
              {option.link ? (
                <Link
                  to={option.link}
                  className="w-full block text-inherit no-underline hover:text-inherit"
                >
                  {option.label}
                </Link>
              ) : (
                option.label
              )}
            </div>
          ))}
          <div className="h-[1px] w-full bg-gray-300 my-2"></div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
