import { Link } from "react-router-dom"; // Import de Link pour la navigation
import logo from "../assets/logo.png"; // Import du logo
import "./Navbar.css"; // Import du fichier de style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  return (
    <nav className="bg-[var(--color-bg)] p-4 flex items-center justify-between">
      <div className="flex items-center justify-between left-side">
        <img src={logo} alt="Logo" className="logo" />
        <div className="search-bar relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg "
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-[var(--color-white)] text-[var(--color-text-secondary)] p-4 pl-14 rounded-full w-120 outline-none"
          />
        </div>
      </div>
      <ul className="flex gap-8 text-lg text-[var(--color-gray)] nav-list ">
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/chercheurs">Chercheurs</Link>
        </li>
        <li>
          <Link to="/publications">Publications</Link>
        </li>
        <li>
          <Link to="/actualites">Actualité</Link>
        </li>
        <li>
          <Link to="/a-propos">A propos</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div></div>
    </nav>
  );
}
export default Navbar;
