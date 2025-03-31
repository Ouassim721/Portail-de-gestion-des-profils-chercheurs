import Card from "./Card";
import pdp from "../assets/chercheur-place-holder.jpg";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4 mt-8">
      <section className="col-span-2 shadow-[0_0_20px_rgba(0,0,0,0.25)] p-8 md:p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
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
              <p className="text-sm mt-1 text-center sm:text-left">
                {chercheur.departement}
              </p>
              {pov == "chercheur" && (
                <div className="flex justify-center my-3 sm:block sm:mx-0 sm:my-2">
                  <Button
                    variant="neutral"
                    icon={faSliders}
                    className="text-sm p-2!"
                  >
                    Modifier
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-center sm:block sm:mr-8">
              <Button variant="secondary">Voir CV</Button>
            </div>
          </div>
        </div>
        <div className="mx-auto my-8 bg-gray-300 h-0.75 w-9/10"></div>
        <div className="flex flex-col md:flex-row my-3">
          <p className="w-full md:w-2/5">
            <strong className="text-md">Organisations</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] text-sm md:text-md ">
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row my-6">
          <p className="w-full md:w-2/5">
            <strong className="text-md">Catégories de sujets</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] text-sm md:text-sm">
            <li>Computer Science</li>
            <li>Computer Science</li>
          </ul>
        </div>
      </section>
      <section className="stats col-span-2 md:col-span-1 row-span-3 shadow-[0_0_20px_rgba(0,0,0,0.25)] p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <div className="flex flex-col gap-4 md-gap-8">
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
        </div>
        <div className="flex flex-col mt-12">
          <h3 className="text-md font-medium tracking-wider text-center">
            Publications par Année
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%" // Position horizontale
                  cy="50%" // Position verticale
                  outerRadius={80} // Taille du cercle
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <section className="col-span-2 row-span-2 shadow-[0_0_20px_rgba(0,0,0,0.25)] p-8 md:p-16 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <h1 className="text-2xl font-semibold mb-12 text-[var(--color-text-primary)] ml-3 ">
          Publications
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
    </div>
  );
}

export default ProfilChercheur;
