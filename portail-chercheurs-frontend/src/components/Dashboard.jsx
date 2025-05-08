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

  const randomData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));
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
        label: t("statResearchers"),
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
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: false },
    },
  };

  useEffect(() => {
    axios.get("/stats")
      .then((response) => {
        setcountChercheurs(response.data.chercheurs);
        setcountPublications(response.data.publications);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du nombre de chercheurs:", error);
      });
  }, []);

  const nombrePublications = countPublications !== null ? countPublications : t("loading");
  const nombreChercheurs = countChercheurs !== null ? countChercheurs : t("loading");
  const randomVisiteurs = Math.floor(Math.random() * 500);

  return (
    <div className="p-4 space-y-4 bg-[var(--color-bg-secondary)] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">{t("statPublications")}</h3>
          <p className="text-2xl font-bold text-black">{nombrePublications}</p>
        </div>
        <div className="bg-green-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">{t("statResearchers")}</h3>
          <p className="text-2xl font-bold text-black">{nombreChercheurs}</p>
        </div>
        <div className="bg-blue-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">{t("statVisitors")}</h3>
          <p className="text-2xl font-bold text-black">{randomVisiteurs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--color-bg-primary)] rounded-md p-4 shadow">
          <div className="rounded-md shadow">
            <h2 className="text-lg font-bold mb-2">{t("chartTitle")}</h2>
            <p className="text-xs text-gray-500 mb-4">{`${t("monthDec")} - ${t("monthJun")} (6 derniers mois)`}</p>
            <div className="h-64">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="flex bg-[var(--color-bg-primary)] rounded-md p-4 shadow">
          <div className="rounded-md flex flex-col gap-6">
            <h3 className="text-lg font-bold">{t("upcomingEventTitle")}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("upcomingEventDesc")}</p>
            <Button>{t("viewMoreButton")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;