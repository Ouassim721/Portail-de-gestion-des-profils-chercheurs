// components/cards/ChercheursGrid.jsx
import ChercheurCard from "./ChercheurCard";

export default function ChercheursGrid({ chercheurs }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chercheurs.map((chercheur) => (
        <ChercheurCard key={chercheur.id} chercheur={chercheur} />
      ))}
    </div>
  );
}
