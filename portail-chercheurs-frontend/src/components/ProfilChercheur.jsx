function ProfilChercheur({ chercheur }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{chercheur.nom}</h2>
      <p>
        <strong>Département :</strong> {chercheur.departement}
      </p>
      <p>
        <strong>Nombre de publications :</strong> {chercheur.publications}
      </p>
      <p>
        <strong>Bio :</strong> Lorem ipsum dolor sit amet...
      </p>
    </div>
  );
}

export default ProfilChercheur;
