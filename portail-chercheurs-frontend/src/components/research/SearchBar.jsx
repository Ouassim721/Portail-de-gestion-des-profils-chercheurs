import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchBar = () => {
  return (
    <>
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-gray)]"
      />
      <input
        type="text"
        placeholder="Rechercher..."
        className="bg-[var(--color-white)] text-[var(--color-text-secondary)] p-2 pl-12 rounded-xl outline-2 outline-gray-200 focus:outline-gray-400"
      />
    </>
  );
};

export default SearchBar;
