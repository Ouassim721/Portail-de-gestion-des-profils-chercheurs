const Card = ({ id, title, author, image, footer, className, cardType }) => {
  const baseStyle =
    "p-3 md:p-4 rounded transition-transform hover:scale-101 flex items-center cursor-pointer m-auto my-6 border-b-2 border-gray-200 ";

  const styles = {
    chercheur: "bg-white-200 p-4",
    publication:
      "bg-[var(--color-white)]  w-[100%] flex flex-col md:flex-row items-center px-4 gap-4 md:gap-10",
    projet: "bg-green-50 p-4",
    actualite:
      "bg-[var(--color-white)]  w-[100%] flex flex-col md:flex-row items-center px-4 gap-4 md:gap-10",
  };

  return (
    <div
      className={`${baseStyle} ${styles[cardType] || "bg-white"} ${className}`}
    >
      {/* ID à gauche */}
      {/* {id && (
        <div className="text-[var(--color-text-primary)] w-14 h-4 md:h-14 flex items-center justify-center rounded-full text-lg font-semibold">
          {id}
        </div>
      )} */}

      {/* Contenu texte */}
      <div className="md:ml-2 flex flex-col justify-center">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        )}
        {title && (
          <h3 className="text-lg mb-4 font-semibold text-[var(--color-primary)] ">
            {title}
          </h3>
        )}
        <p className="text-xs mb-4 text-gray-400">
          Neural Computing and Applications, 2024
        </p>
        <p className="text-sm text-gray-600">
          Nouvelle approche pour l'optimisation des réseaux de neurones
          profonds.
        </p>
      </div>

      {/* Footer */}
      {footer && <div className="ml-auto">{footer}</div>}
    </div>
  );
};

export default Card;
