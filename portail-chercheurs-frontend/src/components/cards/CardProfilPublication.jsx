const CardProfilPublication = ({
  title,
  publicationDate,
  citationCount,
  abstract,
  className,
}) => {
  const truncateAbstract = (text) => {
    const words = text.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return text;
  };

  return (
    <div
      className={`p-4 bg-[var(--color-bg-primary)] border-b-3 border-gray-300 mb-4 ${className}`}
    >
      {/* Titre de la publication */}
      {title && (
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
          {title}
        </h3>
      )}

      {/* Date de publication et nombre de citations */}
      <div className="flex justify-between text-sm text-[var(--color-gray)] mb-3">
        {publicationDate && <span>Publié le: {publicationDate}</span>}
        {citationCount !== undefined && <span>Citations: {citationCount}</span>}
      </div>

      {/* Abstract avec troncation si nécessaire */}
      {abstract && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {truncateAbstract(abstract)}
        </p>
      )}
    </div>
  );
};

export default CardProfilPublication;
