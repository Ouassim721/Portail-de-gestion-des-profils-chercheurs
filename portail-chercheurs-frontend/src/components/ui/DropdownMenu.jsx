import { useState, useRef, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import ChercheurAvatar from "../ui/ChercheurAvatar";

const DropdownMenu = ({ children, sections = [], userProfile }) => {
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
      {/* Déclencheur du menu */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
      >
        {React.Children.map(children, (child) => {
          if (
            child?.type === FontAwesomeIcon &&
            child?.props?.icon === faAngleDown
          ) {
            return React.cloneElement(child, {
              className: `${
                child.props.className
              } transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`,
            });
          }
          return child;
        })}
      </div>

      {isOpen && (
        <div className="absolute right-0 w-72 mt-2 bg-[var(--color-dropdown-bg)] rounded-md shadow-lg z-50 border border-[var(--color-border)]">
          {/* Section profil en haut */}
          {userProfile && (
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ChercheurAvatar
                    chercheur={userProfile}
                    size="md"
                    className="w-10 h-10"
                  />
                </div>
                <div className="flex gap-1 text-[var(--color-text-secondary)]">
                  <h2 className="">{userProfile.prenom} </h2>
                  <h2 className="uppercase font-medium">{userProfile.nom}</h2>
                </div>
              </div>
            </div>
          )}

          {/* Sections du menu */}
          {sections.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`}>
              <div className="py-1">
                {section.options.map((option, optionIndex) => (
                  <div
                    key={`option-${optionIndex}`}
                    onClick={() => {
                      if (option.onClick) option.onClick();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-[var(--color-hover-bg)] cursor-pointer flex items-center gap-3 text-[var(--color-text)]"
                  >
                    {option.icon && (
                      <FontAwesomeIcon
                        icon={option.icon}
                        className="text-[var(--color-text-secondary)] w-5 text-center"
                      />
                    )}
                    {option.link ? (
                      <Link
                        to={option.link}
                        className="block w-full text-[var(--color-text-secondary)] no-underline hover:text-gray-900"
                      >
                        {option.label}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        {option.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {sectionIndex < sections.length - 1 && (
                <div className="border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
