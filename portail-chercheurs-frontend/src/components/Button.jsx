const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon: Icon = null, // Icône facultative
  className = "",
}) => {
  // Définition des styles selon le variant
  const baseStyles =
    "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out cursor-pointer";

  const variantStyles = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-blue-900",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-white)] hover:bg-emerald-400",
    neutral:
      "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-neutral-200 outline outline-neutral-500 ",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}{" "}
      {/* Affiche l'icône si elle est fournie */}
      {children}
    </button>
  );
};

export default Button;
