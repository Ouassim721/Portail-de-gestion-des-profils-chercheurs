import { useState } from "react";

const ChercheurAvatar = ({ chercheur, size = "md", className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-xl",
  };

  const getInitials = () => {
    const firstLetter = chercheur.prenom?.[0]?.toUpperCase() || "";
    const secondLetter = chercheur.nom?.[0]?.toUpperCase() || "";
    return `${firstLetter}${secondLetter}`;
  };

  if (!chercheur.photoProfil || imageError) {
    return (
      <div
        className={`rounded-full bg-gray-300 flex items-center justify-center ${sizeClasses[size]} ${className}`}
        title={`${chercheur.prenom} ${chercheur.nom}`}
      >
        <span className="text-gray-600 font-medium">{getInitials()}</span>
      </div>
    );
  }

  return (
    <img
      src={`http://localhost:8000/${chercheur.photoProfil}`}
      alt={`${chercheur.prenom} ${chercheur.nom}`}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default ChercheurAvatar;
