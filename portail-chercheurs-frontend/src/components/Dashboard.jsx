import React, { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";
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
  const [countChercheurs, setCountChercheurs] = useState(null);
  const [countPublications, setCountPublications] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/stats")
      .then((response) => {
        setCountChercheurs(response.data.chercheurs);
        setCountPublications(response.data.publications);
      })
      .catch((error) => {
        console.error(t("statsLoadError"), error);
      })
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <Loader text={t("loading")} />;

  // Génère des valeurs aléatoires pour les données du graphique
  const randomData = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 20)
  );
  const data = {
    labels: [
      t("monthDec"),
      t("monthJan"),
      t("monthFeb"),
      t("monthMar"),
      t("monthApr"),
      t("monthMay"),
      t("monthJun"),
    ],
    datasets: [
      {
        label: t("chartLabelResearchers"),
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
      legend: { display: true, position: 'top' },
      title: { display: false },
    },
  };

  const visiteurs = Math.floor(Math.random() * 500);

  return (
    <div className="p-4 space-y-4 min-h-screen bg-[var(--color-bg)]">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-md p-4">
          <h3 className="text-sm text-[var(--color-text-secondary)]">
            {t("statPublications")}
          </h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {countPublications}
          </p>
        </div>
        <div className="bg-[var(--color-bg-secondary)] rounded-md p-4">
          <h3 className="text-sm text-[var(--color-text-secondary)]">
            {t("statResearchers")}
          </h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {countChercheurs}
          </p>
        </div>
        <div className="bg-[var(--color-bg-secondary)] rounded-md p-4">
          <h3 className="text-sm text-[var(--color-text-secondary)]">
            {t("statVisitors")}
          </h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {visiteurs}
          </p>
        </div>
      </div>

      {/* Graphique et événement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--color-white)] rounded-md p-4 shadow">
          <h2 className="text-lg font-bold mb-2">
            {t("chartTitle")}
          </h2>
          <div className="h-64">
            <Line data={data} options={options} />
          </div>
        </div>

        <div className="bg-[var(--color-white)] rounded-md p-4 shadow">
          <h3 className="text-lg font-bold">
            {t("upcomingEventTitle")}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("upcomingEventDesc")}
          </p>
          <button
            className="mt-4 px-3 py-1 rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)'
            }}
          >
            {t("viewMoreButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
