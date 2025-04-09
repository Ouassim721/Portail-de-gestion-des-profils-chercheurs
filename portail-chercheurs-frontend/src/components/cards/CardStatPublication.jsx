import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CardStatPublication = ({
  stat = "300",
  title = "Publications Totales",
  className = "",
  icon = faSearch,
  variant = "primary",
}) => {
  return (
    <div className={className}>
      <div className="w-74 h-24 flex gap-3 bg-[var(--color-white)] rounded-xl shadow-xs hover:scale-101 duration-300">
        <div className="flex justify-center items-center p-5">
          <div
            className={`rounded-xl ${
              variant === "secondary" ? "bg-green-100" : "bg-blue-100"
            } p-3`}
          >
            <FontAwesomeIcon
              icon={icon}
              className={`p-0.5 text-xl ${
                variant === "secondary"
                  ? "text-[var(--color-secondary)]"
                  : "text-[var(--color-primary)]"
              }`}
            />
          </div>
        </div>
        <div className="p-3 my-auto">
          <h3
            className={`font-bold text-3xl ${
              variant === "secondary"
                ? "text-[var(--color-secondary)]"
                : "text-[var(--color-primary)]"
            }`}
          >
            {stat}
          </h3>
          <p className="text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default CardStatPublication;
