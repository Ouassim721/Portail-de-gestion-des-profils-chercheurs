const Card = ({ id, title, author, image, footer, className, cardType }) => {
  const baseStyle =
    "shadow-lg p-4 rounded transition-transform hover:scale-101 flex items-center cursor-pointer m-auto my-6";

  const styles = {
    chercheur: "bg-white-200 p-4",
    publication:
      "bg-[var(--color-white)]  w-[100%] flex items-center px-4 gap-10",
    projet: "bg-green-50 p-4",
  };

  return (
    <div
      className={`${baseStyle} ${styles[cardType] || "bg-white"} ${className}`}
    >
      {/* ID à gauche */}
      {id && (
        <div className="text-[var(--color-text-primary)] w-14 h-14 flex items-center justify-center rounded-full text-lg font-semibold">
          {id}
        </div>
      )}

      {/* Contenu texte */}
      <div className="ml-2 flex flex-col justify-center">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        )}
        {title && (
          <h3 className="text-sm tracking-wide mb-4 font-semibold text-[var(--color-primary)] underline ">
            {title}
          </h3>
        )}
        {author && <p className="text-xs text-gray-500">Auteur : {author}</p>}
      </div>

      {/* Footer */}
      {footer && <div className="ml-auto">{footer}</div>}
    </div>
  );
};

export default Card;
