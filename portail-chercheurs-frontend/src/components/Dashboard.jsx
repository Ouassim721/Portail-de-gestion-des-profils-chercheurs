import React from "react";
import { Line } from "react-chartjs-2";
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
        borderColor: "var(--color-primary)", // bleu-500 de Tailwind
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
  };

  // Génère des valeurs aléatoires pour les cartes statistiques
  const randomPublications = Math.floor(Math.random() * 2000);
  const randomChercheurs = Math.floor(Math.random() * 100);
  const randomVisiteurs = Math.floor(Math.random() * 500);

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      {/* Cartes de statistiques avec valeurs aléatoires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Publications</h3>
          <p className="text-2xl font-bold">{randomPublications}</p>
        </div>
        <div className="bg-green-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Chercheurs</h3>
          <p className="text-2xl font-bold">{randomChercheurs}</p>
        </div>
        <div className="bg-blue-100 rounded-md p-4">
          <h3 className="text-sm text-gray-500">Visiteurs</h3>
          <p className="text-2xl font-bold">{randomVisiteurs}</p>
        </div>
      </div>

      {/* Graphique et carte Événement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section graphique */}
        <div className="bg-white rounded-md p-4 shadow">
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

        {/* Carte Événement à venir */}
        <div className="bg-orange-200 rounded-md p-4 flex flex-col justify-between">
          <h3 className="text-lg font-bold">Événement à venir</h3>
          <p className="mt-2 text-sm">
            Découvrez les nouveautés et préparez-vous pour le prochain événement
            qui aura lieu bientôt.
          </p>
          <button className="mt-auto self-start bg-white text-orange-700 px-3 py-1 rounded-md hover:bg-orange-50">
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
