import "./ProfilChercheur.css";
import pdp from "../assets/chercheur-place-holder.jpg";
function ProfilChercheur({ chercheur }) {
  return (
    <div>
      <section className="info-general p-8 m-4 mt-12 w-3/5 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <div className="flex gap-16">
          <img src={pdp} alt="Photo de profile" className="rounded-full w-32" />
          <div>
            <h2 className="text-3xl font-bold">{chercheur.nom}</h2>
            <p className="text-sm mt-1">{chercheur.departement}</p>
          </div>
        </div>
        <div className="mx-auto my-8 bg-gray-300 h-0.75 w-9/10"></div>
        <div className="flex my-3">
          <p className="w-2/5">
            <strong className="text-md">Organisations</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
          </ul>
        </div>
        <div className="flex my-6">
          <p className="w-2/5">
            <strong className="text-md">Catégories de sujets</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Computer Science</li>
            <li>Computer Science</li>
          </ul>
        </div>
      </section>
      <section className="info-general p-8 m-4 mt-12 w-3/5 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]"></section>
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
