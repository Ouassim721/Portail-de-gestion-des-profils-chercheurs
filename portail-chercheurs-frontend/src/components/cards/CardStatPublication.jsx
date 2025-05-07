import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardStatPublication = ({
  stat = "300",
  title = "Publications Totales",
  className = "",
  icon,
  variant = "primary",
}) => {
  return (
    <div className={className}>
      <div className="w-74 h-24 flex gap-3 bg-[var(--color-white)] rounded-xl shadow-sm hover:scale-101 transition-transform duration-300">
        <div className="flex justify-center items-center p-5">
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor:
                variant === "secondary"
                  ? "var(--color-secondary-light)"
                  : "var(--color-primary-light)",
              color:
                variant === "secondary"
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
            }}
          >
            <FontAwesomeIcon icon={icon} className="text-xl" />
          </div>
        </div>
        <div className="p-3 my-auto">
          <h3
            className="font-bold text-3xl"
            style={{
              color:
                variant === "secondary"
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
            }}
          >
            {stat}
          </h3>
          <p className="text-[var(--color-text-secondary)]">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default CardStatPublication;
