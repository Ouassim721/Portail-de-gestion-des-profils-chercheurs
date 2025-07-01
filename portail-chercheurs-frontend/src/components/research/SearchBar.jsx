import React, { useState, useEffect, useRef } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { logError } from "@/utils/logger";

const SearchBar = ({ placeholder = "Rechercher un Profil..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    if (query.length > 1) {
      axios
        .get(`/chercheurs/search?q=${query}`)
        .then((res) => {
          setSuggestions(res.data);
          setShowSuggestions(true);
        })
        .catch((err) => {
          logError(err);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setQuery("");
    setShowSuggestions(false);
    navigate(`/chercheurs/${id}`);
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 text-[var(--color-text-secondary)] "
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-gray-300 w-full mt-1 rounded shadow">
          {suggestions.map((chercheur) => (
            <li
              key={chercheur.id}
              className="px-4 py-2 hover:bg-gray-400 hover:text-white cursor-pointer"
              onClick={() => handleSelect(chercheur.id)}
            >
              {chercheur.prenom} {chercheur.nom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
