import { useState, useEffect, useContext } from "react";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CommentsDashboard() {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({ total: null, chartData: [] });
  const [loading, setLoading] = useState(true);

  const getMonthLabels = () => {
    const monthNames = [
      t("monthJan"), t("monthFeb"), t("monthMar"),
      t("monthApr"), t("monthMay"), t("monthJun"),
      t("monthJul"), t("monthAug"), t("monthSep"),
      t("monthOct"), t("monthNov"), t("monthDec")
    ];
    
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return monthNames[date.getMonth()];
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resChart] = await Promise.all([
          axios.get("/stats"),
          axios.get("/stats/comments")
        ]);

        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - i));
          return {
            year: date.getFullYear(),
            month: date.getMonth() + 1
          };
        });

        const formattedData = lastSixMonths.map(({ year, month }) => {
          const found = resChart.data.find(
            item => item.year == year && item.month == month.toString().padStart(2, '0')
          );
          return found ? found.count : 0;
        });

        setStats({
          total: resStats.data.comments,
          chartData: formattedData
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcul des métriques supplémentaires
  const averageComments = Math.round(stats.chartData.reduce((a, b) => a + b, 0) / 6);
  const peakValue = Math.max(...stats.chartData);
  const peakMonth = getMonthLabels()[stats.chartData.indexOf(peakValue)];

  const chartData = {
    labels: getMonthLabels(),
    datasets: [
      {
        label: t("statComments"),
        data: stats.chartData,
        borderColor: "rgb(99 102 241)",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return createGradient(ctx, chartArea);
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(99 102 241)",
        pointBorderWidth: 2,
      }
    ],
  };

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.05)");
    return gradient;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          color: "#6B7280",
          font: { weight: 500 }
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        border: { display: false }
      },
      x: {
        ticks: {
          color: "#6B7280",
          font: { weight: 500 }
        },
        grid: { display: false },
        border: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        callbacks: {
          label: (context) => `${context.parsed.y} ${t("comments")}`
        }
      }
    },
    interaction: { mode: 'index', intersect: false }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Total des commentaires */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">{t("totalComments")}</h3>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Carte Moyenne mensuelle */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">{t("averageComments")}</h3>
              <p className="text-3xl font-bold mt-2">{averageComments}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Carte Pic d'activité */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">{t("peakActivity")}</h3>
              <p className="text-3xl font-bold mt-2">{peakValue}</p>
              <p className="text-sm mt-1 opacity-90">{peakMonth}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t("commentTrend")}</h2>
            <p className="text-sm text-gray-500">{t("last6Months")}</p>
          </div>
        </div>
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}