import "./Chercheurs.css"; // Import du fichier CSS

function Chercheurs() {
  return (
    <div className="chercheurs-container">
      {/* Grande image en haut */}
      <div className="header-image">
        <img src="/chercheurs-banner.jpg" alt="Chercheurs" />
      </div>

      {/* Tableau des chercheurs */}
      <div className="table-container">
        <h2>Liste des chercheurs</h2>
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

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Portail des Chercheurs. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default Chercheurs;
