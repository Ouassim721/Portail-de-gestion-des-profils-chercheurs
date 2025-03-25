import "./Chercheurs.css"; // Import du fichier CSS
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import book from "../assets/book.jpg";

function Chercheurs() {
  return (
    <div className="chercheurs-container">
      {/* Grande image en haut */}
      <div className="header-image">
        <img src={book} alt="Chercheurs" />
      </div>
      <div className="flex justify-between items-center px-16 py-8">
        <h1>Chercheurs</h1>
        <Button variant="neutral">
          <FontAwesomeIcon icon={faSearch} /> Click
        </Button>
      </div>
      {/* Tableau des chercheurs */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Département</th>
              <th>Publications</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Mohamed Ali</td>
              <td>Informatique</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Dr. Sara Karim</td>
              <td>Mathématiques</td>
              <td>15</td>
            </tr>
            <tr>
              <td>Dr. Yassine Amine</td>
              <td>Physique</td>
              <td>8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Chercheurs;
