import { useEffect, useState } from "react";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserMinus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { log } from "@/utils/logger";
import { logError } from "@/utils/logger";

const FollowButton = ({ targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    axios
      .get(`/is-following/${targetUserId}`) // Notez l'ajout de /api/
      .then((res) => {
        setIsFollowing(res.data.isFollowing);
      })
      .catch((err) => {
        setError("Impossible de vérifier l'abonnement");
        logError("Erreur is-following:", err);
      })
      .finally(() => setLoading(false));
  }, [targetUserId]);

  const toggleFollow = () => {
    setLoading(true);
    setError(null);

    const endpoint = isFollowing
      ? `/unfollow/${targetUserId}`
      : `/follow/${targetUserId}`;
    const method = isFollowing ? "delete" : "post";
    log({ method, url: endpoint });

    axios({ method, url: endpoint })
      .then(() => {
        setIsFollowing(!isFollowing);
      })
      .catch((err) => {
        setError(
          isFollowing ? "Échec de la désabonnement" : "Échec de l'abonnement"
        );
        // logError("Erreur follow/unfollow:", err);
        logError("Erreur détaillée:", err.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium flex items-center justify-center min-w-28"
      >
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        Chargement...
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center min-w-28 transition-colors duration-200 ${
          isFollowing
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {isFollowing ? (
          <>
            <FontAwesomeIcon icon={faUserMinus} className="mr-2" />
            Se désabonner
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Suivre
          </>
        )}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default FollowButton;
