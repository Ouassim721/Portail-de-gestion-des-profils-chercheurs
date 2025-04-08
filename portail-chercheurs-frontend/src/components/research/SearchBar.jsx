import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchBar = ({ className = "", placeHolder = "Rechercher..." }) => {
  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-gray)]"
      />
      <input
        type="text"
        placeholder={placeHolder}
        className={`bg-[var(--color-white)] text-[var(--color-text-secondary)] p-2 pl-12 rounded-xl outline-2 outline-gray-200 focus:outline-gray-400 ${className} `}
      />
    </div>
  );
};

export default SearchBar;
