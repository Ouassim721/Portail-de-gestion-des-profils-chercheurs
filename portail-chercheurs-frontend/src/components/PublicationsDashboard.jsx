import { useState, useEffect, useContext } from "react";
import { Bar, Line } from "react-chartjs-2";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import { LanguageContext } from "../contexts/LanguageContext";
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/solid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PublicationsDashboard() {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({
    total: null,
    chartData: [],
    currentMonthCount: 0,
    average: 0,
    percentageChange: 0,
    lastMonthCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const getMonthLabels = () => {
    const labels = [];
    const date = new Date();
    const monthNames = [
      t("monthJan"),
      t("monthFeb"),
      t("monthMar"),
      t("monthApr"),
      t("monthMay"),
      t("monthJun"),
      t("monthJul"),
      t("monthAug"),
      t("monthSep"),
      t("monthOct"),
      t("monthNov"),
      t("monthDec"),
    ];

    for (let i = 5; i >= 0; i--) {
      const tempDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
      labels.push(monthNames[tempDate.getMonth()]);
    }

    return labels;
  };
  const getCssVariable = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const colorTextPrimary = getCssVariable("--color-text-primary");
  const colorTextSecondary = getCssVariable("--color-text-secondary");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resChart] = await Promise.all([
          axios.get("/stats"),
          axios.get("/stats/publications"),
        ]);

        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - i));
          return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          };
        });

        const formattedData = lastSixMonths.map(({ year, month }) => {
          const found = resChart.data.find(
            (item) =>
              item.year == year &&
              item.month == month.toString().padStart(2, "0")
          );
          return found ? found.count : 0;
        });

        const currentMonthCount = formattedData[5];
        const lastMonthCount = formattedData[4];
        const percentageChange =
          lastMonthCount !== 0
            ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
            : 0;

        setStats({
          total: resStats.data.publications,
          chartData: formattedData,
          currentMonthCount,
          average: formattedData.reduce((a, b) => a + b, 0) / 6,
          percentageChange,
          lastMonthCount,
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: getMonthLabels(),
    datasets: [
      {
        label: t("statPublications"),
        data: stats.chartData,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const comparisonData = {
    labels: [t("lastMonth"), t("currentMonth")],
    datasets: [
      {
        data: [stats.lastMonthCount, stats.currentMonthCount],
        backgroundColor: ["rgba(99, 102, 241, 0.5)", "rgba(234, 179, 8, 0.5)"],
        borderColor: ["rgba(99, 102, 241, 1)", "rgba(234, 179, 8, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { color: colorTextSecondary, stepSize: 1 },
      },
      x: {
        grid: { display: false },
        ticks: { color: colorTextSecondary },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: colorTextSecondary,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `${context.parsed.y} publications`,
        },
      },
    },
  };

  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: colorTextSecondary,
        },
      },
      tooltip: { enabled: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { color: colorTextSecondary, stepSize: 1 },
      },
      x: {
        grid: { display: false },
        ticks: { color: colorTextSecondary },
      },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6 bg-[var(--color-bg-secondary)] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
          <h3 className="text-sm font-light">{t("totalPublications")}</h3>
          <p className="text-3xl font-bold my-2">
            {stats.total?.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
          <h3 className="text-sm font-light">{t("thisMonth")}</h3>
          <p className="text-3xl font-bold my-2">{stats.currentMonthCount}</p>
          <div className="flex items-center text-xs">
            {stats.percentageChange >= 0 ? (
              <ArrowUpRightIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowUpDownIcon className="w-4 h-4 mr-1" />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
          <h3 className="text-sm font-light">{t("monthlyAverage")}</h3>
          <p className="text-3xl font-bold my-2">{Math.round(stats.average)}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-4 text-white shadow-lg">
          <h3 className="text-sm font-light">{t("lastMonth")}</h3>
          <p className="text-3xl font-bold my-2">{stats.lastMonthCount}</p>
          <div className="text-xs opacity-80">
            vs {stats.currentMonthCount} ce mois
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-8">
            {t("publicationTrend")}
          </h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-8">
            {t("monthlyComparison")}
          </h2>
          <div className="h-80">
            <Bar data={comparisonData} options={comparisonOptions} />
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {comparisonData.labels.map((label, index) => (
              <div key={label} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor:
                      comparisonData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
