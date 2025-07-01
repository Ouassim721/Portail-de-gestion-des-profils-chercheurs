import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

const Button = ({
  children,
  onClick,
  type = "submit",
  variant = "primary",
  icon = null,
  iconPosition = "left",
  className = "",
}) => {
  const { t } = useContext(LanguageContext);

  const baseStyles =
    "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out cursor-pointer justify-center";

  const variantStyles = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-white)] hover:opacity-90",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-white)] hover:opacity-90",
    secondaryoutline:
      "border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-white)]",
    neutral:
      "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-gray)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={typeof children === 'string' ? t(children) : undefined}
    >
      {icon && iconPosition === "left" && (
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      )}
      {typeof children === 'string' ? t(children) : children}
      {icon && iconPosition === "right" && (
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      )}
    </button>
  );
};

export default Button;