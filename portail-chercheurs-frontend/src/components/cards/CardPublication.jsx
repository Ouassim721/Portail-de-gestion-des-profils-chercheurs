import React, { useContext } from "react";
import pdp from "../../assets/chercheur-place-holder.jpg";
import Button from "../ui/Button";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const CardPublication = ({
  id,
  title,
  auteur,
  university,
  departement,
  description,
  category = [],
  date,
  citations,
  className,
}) => {
  const { t, formatDate } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <div
      className={`w-full p-4 lg:p-8 bg-[var(--color-bg-primary)] flex flex-col lg:flex-row gap-6 mx-auto my-4 drop-shadow-md hover:drop-shadow-lg hover:scale-101 duration-300 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-[var(--color-primary)] md:text-xl">
          {title || t("noTitleAvailable")}
        </h2>
        <div className="flex items-center gap-4">
          <img
            src={pdp}
            alt={t("avatarAlt", { name: auteur })}
            className="rounded-full w-15 h-15"
          />
          <div>
            <h3 className="text-md font-medium md:text-lg text-[var(--color-text-primary)]">
              {t("drPrefix")} {auteur}
            </h3>
            <p className="text-sm font-light md:text-md text-[var(--color-text-secondary)]">
              {university} - {t("departmentLabel")} {departement}
            </p>
          </div>
        </div>
        {description && (
          <p className="text-md text-[var(--color-text-secondary)] text-justify">
            {description.length > 300
              ? `${description.slice(0, 300)}...`
              : description}
          </p>
        )}
        <div className="flex gap-2 flex-wrap">
          {category.map((item) => (
            <h6
              key={item}
              className="py-2 px-5 rounded-full bg-blue-50 text-blue-900 font-light"
            >
              {item}
            </h6>
          ))}
        </div>
      </div>
      <div className="flex lg:flex-col justify-between items-center lg:w-1/3 lg:min-w-42">
        <div className="lg:flex lg:flex-col lg:gap-2 lg:text-right lg:w-full lg:pr-3">
          <h6 className="font-light text-sm text-[var(--color-text-secondary)]">
            {t("publishedOn")}{" "}
            {date
              ? formatDate(date, { dateStyle: "medium" })
              : t("dateNotAvailable")}
          </h6>
          <h5 className="hidden lg:block font-bold text-xl text-[var(--color-text-primary)]">
            {citations}{" "}
            <span className="font-light text-sm text-[var(--color-text-secondary)]">
              {t("citationsLabel")}
            </span>
          </h5>
        </div>
        <div className="flex lg:flex-col gap-4 lg:w-full">
          <Button
            icon={faCircleInfo}
            variant="secondaryoutline"
            className="font-light h-10"
            onClick={() => navigate(`/details-publication/${id}`)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardPublication;