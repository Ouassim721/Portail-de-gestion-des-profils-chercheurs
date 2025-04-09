import pdp from "../../assets/chercheur-place-holder.jpg";
import Button from "../Button";
import { faDownload, faShareNodes } from "@fortawesome/free-solid-svg-icons";

const CardPublication = ({
  title = "Intelligence Artificielle et Apprentissage Automatique : Une Approche Moderne",
  auteur = "Thomas Martin",
  university = "Univérsité Cadi Ayaad",
  departement = "Informatique",
  description = "Une étude approfondie des dernières avancées en intelligence artificielle et leurs applications dans divers domaines industriels.",
  category = ["IA", "Machine Learning", "Deep Learning", "Web"],
  date = "15 Jan 2025",
  citations = "156",
}) => {
  return (
    <div
      className="w-full p-4 lg:p-8 bg-[var(--color-white)] flex flex-col lg:flex-row gap-8 mx-auto my-4 drop-shadow-md hover:drop-shadow-lg
 hover:scale-101 duration-300"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-[var(--color-primary)] md:text-xl">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <img
            src={pdp}
            alt="Chercheur photo de profil"
            className="rounded-full w-15 h-15"
          />
          <div>
            <h3 className="text-md font-medium md:text-lg">Dr. {auteur}</h3>
            <p className="text-sm font-light md:text-md text-neutral-400">
              {university} - Département {departement}
            </p>
          </div>
        </div>
        <p className="text-md text-neutral-500">{description}</p>
        <div className="flex gap-2">
          {category.map((item) => {
            return (
              <h6 className="py-2 px-5 rounded-full bg-blue-50 text-blue-900 font-light">
                {item}
              </h6>
            );
          })}
        </div>
      </div>
      <div className="flex lg:flex-col justify-between lg:justify- items-center  lg:w-1/3">
        <div className="lg:flex lg:flex-col lg:gap-2 lg:text-right lg:w-full lg:pr-3">
          <h6 className="font-light text-sm text-neutral-500">
            Publié le {date}
          </h6>
          <h5 className="hidden lg:block font-bold text-xl">
            {citations}{" "}
            <span className="font-light text-neutral-700 text-sm">
              Citations
            </span>
          </h5>
        </div>
        <div className="flex lg:flex-col gap-4 lg:w-full">
          <Button
            icon={faDownload}
            variant="secondary"
            className="font-light! h-10"
          >
            Télécharger PDF
          </Button>
          <Button
            icon={faShareNodes}
            variant="secondaryoutline"
            className="font-light! h-10"
          >
            Partager
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardPublication;
