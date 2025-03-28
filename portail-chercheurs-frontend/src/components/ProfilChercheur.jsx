import "./ProfilChercheur.css";
import Card from "./Card";
import pdp from "../assets/chercheur-place-holder.jpg";
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

function ProfilChercheur({ chercheur }) {
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
    <div className="grid grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4 mt-8">
      <section className="col-span-2 box p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <div className="flex gap-16">
          <img src={pdp} alt="Photo de profile" className="rounded-full w-32" />
          <div>
            <h2 className="text-3xl font-bold">{chercheur.nom}</h2>
            <p className="text-sm mt-1">{chercheur.departement}</p>
          </div>
        </div>
        <div className="mx-auto my-8 bg-gray-300 h-0.75 w-9/10"></div>
        <div className="flex my-3">
          <p className="w-2/5">
            <strong className="text-md">Organisations</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
          </ul>
        </div>
        <div className="flex my-6">
          <p className="w-2/5">
            <strong className="text-md">Catégories de sujets</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Computer Science</li>
            <li>Computer Science</li>
          </ul>
        </div>
      </section>
      <section className="stats row-span-3 box p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <div className="flex flex-col gap-8">
          <h3 className="text-md font-medium tracking-wider text-center">
            Publications par Année
          </h3>
          <div className="h-50">
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
      <section className="col-span-2 row-span-2 box p-16 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
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
