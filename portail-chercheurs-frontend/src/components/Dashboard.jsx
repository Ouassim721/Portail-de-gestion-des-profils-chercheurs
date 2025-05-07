import { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";
import Button from "./ui/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { t } = useContext(LanguageContext);

  const [countChercheurs, setcountChercheurs] = useState(null);
  const [countPublications, setcountPublications] = useState(null);

  // Génère des valeurs aléatoires pour les données du graphique
  const randomData = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 20)
  );
  const data = {
    labels: ["Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Chercheurs",
        data: randomData,
        borderColor: "var(--color-primary)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: false },
    },
  };

  useEffect(() => {
    axios
      .get("/stats")
      .then((response) => {
        setcountChercheurs(response.data.chercheurs);
        setcountPublications(response.data.publications);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de chercheurs:",
          error
        );
      });
  }, []);
  // Génère des valeurs aléatoires pour les cartes statistiques
  const nombrePublications =
    countPublications !== null ? countPublications : "Chargements...";
  const nombreChercheurs =
    countChercheurs !== null ? countChercheurs : "Chargements...";
  const randomVisiteurs = Math.floor(Math.random() * 500);

  return (
    <div className="p-4 space-y-4 bg-[var(--color-bg-secondary)] min-h-screen">
      {/* Cartes de statistiques avec valeurs aléatoires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Publications</h3>
          <p className="text-2xl font-bold text-black">{nombrePublications}</p>
        </div>
        <div className="bg-green-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Chercheurs</h3>
          <p className="text-2xl font-bold text-black">{nombreChercheurs}</p>
        </div>
        <div className="bg-blue-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Visiteurs</h3>
          <p className="text-2xl font-bold text-black">{randomVisiteurs}</p>
        </div>
      </div>

      {/* Graphique et carte Événement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--color-bg-primary)] rounded-md p-4 shadow">
          {/* Section graphique */}
          <div className="rounded-md shadow">
            <h2 className="text-lg font-bold mb-2">
              Statistiques des chercheurs
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Déc - Juin (les 6 derniers mois)
            </p>
            <div className="h-64">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="flex bg-[var(--color-bg-primary)] rounded-md p-4 shadow">
          {/* Carte Événement à venir */}
          <div className="rounded-md flex flex-col gap-6">
            <h3 className="text-lg font-bold">{t("upcomingEventTitle")}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {t("upcomingEventDesc")}
            </p>
            <Button>{t("viewMoreButton")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
