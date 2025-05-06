import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({
  children,
  onClick,
  type = "submit",
  variant = "primary",
  icon = null, // Icône facultative
  iconPosition = "left", // corrigé
  className = "",
}) => {
  // Définition des styles selon le variant
  const baseStyles =
    "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out cursor-pointer justify-center";

  const variantStyles = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-blue-900",
    secondary: "bg-[var(--color-secondary)] text-white hover:bg-emerald-400",
    secondaryoutline:
      "bg-transparent text-[var(--color-secondary)] outline outline-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-bg-primary)]",
    neutral:
      "var(--color-bg-primary) px-4 py-2 border border-gray-300 rounded-md text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {icon && iconPosition === "left" && (
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      )}
    </button>
  );
};

export default Button;
