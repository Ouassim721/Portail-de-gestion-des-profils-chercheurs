import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ChercheurAvatar from "../ui/ChercheurAvatar";
import FollowButton from "../ui/FollowButton";

export default function ChercheurCard({ chercheur }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chercheurs/${chercheur.id}`);
  };
  return (
    <div
      className="bg-[var(--color-bg-primary)] rounded-lg overflow-hidden transition-shadow duration-300 cursor-pointer shadow-card hover:shadow-card-hover"
      onClick={handleClick}
    >
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0">
          <ChercheurAvatar
            chercheur={chercheur}
            size="lg"
            className="w-16 h-16 mx-auto sm:mx-0"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
            {chercheur.prenom} {chercheur.nom}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-2">
            {chercheur.specialisation || "Département non spécifié"}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faBook} className="mr-1" />
            <span>{chercheur.publications_count || 0} publications</span>
          </div>
        </div>
      </div>
    </div>
  );
}
