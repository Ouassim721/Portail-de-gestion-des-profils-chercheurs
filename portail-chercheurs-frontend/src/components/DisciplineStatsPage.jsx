import React, { useState, useEffect, useContext } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { LanguageContext } from "../contexts/LanguageContext";;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DisciplineStatsPage = () => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState("publications_count");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/disciplines/stats",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const rawData = await response.text();
        if (!response.ok) {
          throw new Error(`${t("errorStatus")} ${response.status}: ${response.statusText}`);
        }
        setStats(JSON.parse(rawData));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const handleSort = column => {
    if (column === sortColumn) {
      setSortDirection(dir => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedStats = [...stats].sort((a, b) => {
    const m = sortDirection === "asc" ? 1 : -1;
    if (sortColumn === "nom") return a.nom.localeCompare(b.nom) * m;
    return ((a[sortColumn]||0) - (b[sortColumn]||0)) * m;
  });

  const prepareChartData = () => {
    const labels = stats.map(d => d.nom);
    return {
      barData: {
        labels,
        datasets: [
          {
            label: t("publicationsLabel"),
            data: stats.map(d => d.publications_count || 0),
            backgroundColor: "rgba(79, 70, 229, 0.7)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: t("citationsLabel"),
            data: stats.map(d => d.total_citations || 0),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      doughnutData: {
        labels,
        datasets: [
          {
            data: stats.map(d => d.publications_count || 0),
            backgroundColor: stats.map(
              (_, i) => `hsl(${(i * 360) / stats.length}, 70%, 50%)`
            ),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      },
    };
  };

  const SortIcon = ({ direction }) => (
    <span className="ml-2">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { padding: 20, usePointStyle: true },
      },
      title: {
        display: true,
        text: t("barChartTitle"),
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: t("axisTotal") },
        ticks: { callback: v => v.toLocaleString() },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { padding: 20, usePointStyle: true } },
      title: { display: true, text: t("doughnutChartTitle") },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
            const pct = ((ctx.raw/total)*100).toFixed(1);
            return `${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-4">{t("loadingStats")}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <h3 className="text-red-600">{t("errorLoading")}</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="bg-indigo-600 px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">{t("statsHeader")}</h2>
          <p className="mt-1">{t("statsSubheader")}</p>
        </div>
        <div className="p-6">
          {stats.length > 0 ? (
            <>
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 h-96">
                  <Bar data={prepareChartData().barData} options={barOptions} />
                </div>
                <div className="h-96">
                  <Doughnut data={prepareChartData().doughnutData} options={doughnutOptions} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {["nom","publications_count","total_citations"].map(col => (
                        <th
                          key={col}
                          className={`px-6 py-3 text-${col==="nom"?"left":"right"} text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer`}
                          onClick={() => handleSort(col)}
                        >
                          <div className={`flex items-center justify-${col==="nom"?"start":"end"}`}>
                            {t(col==="nom"?"colDiscipline":col==="publications_count"?"colPublications":"colCitations")}
                            {sortColumn===col && <SortIcon direction={sortDirection} />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedStats.map(d => (
                      <tr key={d.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{d.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">{(d.publications_count||0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">{(d.total_citations||0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-yellow-700">
              {t("noData")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisciplineStatsPage;