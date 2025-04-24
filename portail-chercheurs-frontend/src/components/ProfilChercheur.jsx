import { useState, useEffect } from "react";
import pdp from "../assets/chercheur-place-holder.jpg";
import Card from "./cards/Card";
import Button from "./ui/Button";
import UserSettingsPopup from "./ui/UserSettingsPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faTimes,
  faUserPen,
  faLocationDot,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faFilePdf } from "@fortawesome/free-regular-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function ProfilChercheur({ chercheur, pov = "invite" }) {
  // Données des publications (exemple)
  const dataBar = [
    { year: "2019", publications: 5 },
    { year: "2020", publications: 8 },
    { year: "2021", publications: 12 },
    { year: "2022", publications: 10 },
    { year: "2023", publications: 15 },
  ];
  const dataPie = [
    { name: "Articles de revue", value: 10 },
    { name: "Conférences", value: 7 },
    { name: "Chapitres de livre", value: 5 },
    { name: "Autres", value: 3 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Couleurs pour chaque catégorie
  const [editPopup, setEditPopup] = useState(false);

  const openPopup = () => {
    setEditPopup(true);
  };

  const closePopup = () => {
    setEditPopup(null);
  };
  useEffect(() => {
    if (editPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [editPopup]);
  return (
    <div className="grid grid-rows-[auto_auto_ato] grid-cols-[auto_auto_auto] gap-4 mt-8">
      {/* ***************La section principale de photo et les bouttons ********************************/}
      <section className="col-span-3 p-8 md:p-8 rounded shadow-sm bg-[var(--color-white)] text-[var(--color-text-primary)] h-50 border-gray-200">
        <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-12 lg:gap-16">
          <img
            src={pdp}
            alt="Photo de profile"
            className="rounded-full w-24 sm:w-28 lg:w-32 mx-auto sm:mx-0"
          />
          <div className="sm:flex sm:justify-between w-full mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center sm:text-left">
                {chercheur.nom}
              </h2>
              <p className="text-sm mt-1 text-center sm:text-left text-[var(--color-text-primary)]">
                Départemant {chercheur.departement}
              </p>
              <p className="text-sm mt-1 text-center sm:text-left text-[var(--color-text-secondary)]">
                Université {chercheur.university} Cadi Ayaad
              </p>
              {pov == "chercheur" && (
                <div className="flex  gap-4 justify-center my-3 sm:mx-0 sm:my-2">
                  <Button
                    variant="secondary"
                    icon={faEnvelope}
                    className="text-sm p-2!"
                  >
                    Contacter
                  </Button>
                  <Button
                    variant="neutral"
                    icon={faFilePdf}
                    className="text-sm p-2!"
                  >
                    Voir CV
                  </Button>
                </div>
              )}
              {editPopup && (
                <div className="popup-overlay">
                  <div className="popup-content w-[95%] h-[90%] sm:w-[80%] md:w-[65%] lg:w-[60%]  xl:w-[50%] ">
                    {/* Bouton de fermeture */}
                    <button className="close-btn" onClick={closePopup}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    {/* Affichage du profil */}
                    <UserSettingsPopup></UserSettingsPopup>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center sm:block sm:mr-8">
              <Button
                variant="primary"
                icon={faUserPen}
                className="text-sm p-2!"
                onClick={openPopup}
              >
                Modifier
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* ***************La section des Publication********************************/}
      <section className="row-span-3 col-span-2 p-4 md:p-8 rounded-2xl shadow-sm bg-[var(--color-white)] text-[var(--color-text-primary)] border-gray-200">
        <h1 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)] ml-3 ">
          Publications récentes
        </h1>
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
      </section>
      {/* ***************La section des Informations********************************/}
      <section className="flex flex-col gap-4 md-gap-8 p-8 shadow-sm bg-[var(--color-white)] border-gray-200">
        <h3 className="tracking-wide font-bold text-xl mb-4">Informations</h3>
        <ul className="flex flex-col gap-4 list-none text-[var(--color-text-primary)]">
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faBuildingColumns} />
            </span>
            Département Informatique
          </li>
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            Safi, Maroc
          </li>
          <li>
            <span className="mr-3">
              <FontAwesomeIcon icon={faGraduationCap} />
            </span>
            PhD en Intelligence Artificielle
          </li>
        </ul>
      </section>
      {/* ***************La section des Statistiques********************************/}

      <section className="flex flex-col gap-4 md-gap-8 p-8 shadow-sm bg-[var(--color-white)] text-[var(--color-text-primary)] border-gray-200">
        <h3 className="tracking-wide font-bold text-xl mb-4">Statistiques</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="text-[var(color-text-secondary)] ">Publications</h3>
            <h3 className="font-semibold text-lg">47</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-[var(color-text-secondary)] ">Citations</h3>
            <h3 className="font-semibold text-lg">1250</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-[var(color-text-secondary)] ">H-index</h3>
            <h3 className="font-semibold text-lg">15</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-[var(color-text-secondary)] ">
              Projets de recherche
            </h3>
            <h3 className="font-semibold text-lg">12</h3>
          </div>
        </div>
      </section>
      {/* ***************La section de GRAPHE********************************/}

      <section className="flex flex-col gap-4 md-gap-8 p-8 shadow-sm bg-[var(--color-white)] border-gray-200">
        <h3 className="text-md font-medium tracking-wider text-center">
          Publications par Année
        </h3>
        <div className="h-40 md:h-50 max-w-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="publications" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default ProfilChercheur;
