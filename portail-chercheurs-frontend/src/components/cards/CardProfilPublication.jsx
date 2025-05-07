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
      className={`p-4 mb-4 rounded-lg shadow-sm ${className}`}
      style={{
        backgroundColor: 'var(--color-white)',
        borderBottom: '3px solid var(--color-bg-secondary)'
      }}>
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">{title}</h3>
      <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-3">
        <span>Publié le: {publicationDate}</span>
        <span>Citations: {citationCount}</span>
      </div>
      <p className="text-sm text-[var(--color-text-primary)]">{abstract}</p>
    </div>
  );
};

export default CardProfilPublication;