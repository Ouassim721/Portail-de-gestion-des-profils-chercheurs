import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBarPublications = ({ 
  value, 
  onChange, 
  placeHolder, 
  className, 
  onKeyPress 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FontAwesomeIcon 
          icon={faSearch} 
          className="text-gray-400" 
        />
      </div>
      <input
        type="text"
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
      />
    </div>
  );
};

export default SearchBarPublications;