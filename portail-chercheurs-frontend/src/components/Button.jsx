import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon = null, // Icône facultative
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
      "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-neutral-200 outline outline-gray-300 ",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {/* Utilise FontAwesome pour l'icône */}

      {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
