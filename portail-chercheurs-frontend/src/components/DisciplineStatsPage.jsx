import React, { useState, useEffect } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DisciplinesStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState("publications_count");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchStats = async () => {
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
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        try {
          const data = JSON.parse(rawData);
          setStats(data);
        } catch (e) {
          throw new Error(`Réponse non-JSON: ${rawData.substring(0, 80)}...`);
        }
      } catch (err) {
        setError(err.message);
        console.error("Erreur complète:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedStats = [...stats].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;

    if (sortColumn === "nom") {
      return a.nom.localeCompare(b.nom) * multiplier;
    }

    const valueA = a[sortColumn] || 0;
    const valueB = b[sortColumn] || 0;
    return (valueA - valueB) * multiplier;
  });

  const SortIcon = ({ direction }) => (
    <span className="ml-2">
      {direction === "asc" ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </span>
  );

  const prepareChartData = () => {
    const labels = stats.map((d) => d.nom);

    return {
      barData: {
        labels,
        datasets: [
          {
            label: "Publications",
            data: stats.map((d) => d.publications_count || 0),
            backgroundColor: "rgba(79, 70, 229, 0.7)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Citations",
            data: stats.map((d) => d.total_citations || 0),
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
            data: stats.map((d) => d.publications_count || 0),
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Comparatif Publications/Citations par Discipline",
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: "600",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            return `${label}: ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          callback: (value) => value.toLocaleString(),
        },
        title: {
          display: true,
          text: "Nombre total",
          font: {
            family: "'Inter', sans-serif",
            weight: "500",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Répartition des Publications",
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: "600",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${
              context.label
            }: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">
            Chargement des statistiques...
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Veuillez patienter pendant que nous récupérons les données.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur de chargement
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg overflow-hidden">
        <div className="bg-[var(--color-primary)] px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            Statistiques des Disciplines
          </h2>
          <p className="mt-1 text-indigo-200">
            Analyse des publications et citations par domaine de recherche
          </p>
        </div>

        <div className="px-6 py-5">
          {stats.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 rounded-lg p-5 shadow-sm ">
                  <div className="h-96">
                    <Bar
                      data={prepareChartData().barData}
                      options={barOptions}
                    />
                  </div>
                </div>

                <div className="rounded-lg p-5 shadow-sm">
                  <div className="h-96">
                    <Doughnut
                      data={prepareChartData().doughnutData}
                      options={doughnutOptions}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[var(--color-gray)] shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("nom")}
                      >
                        <div className="flex items-center">
                          Discipline
                          {sortColumn === "nom" && (
                            <SortIcon direction={sortDirection} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("publications_count")}
                      >
                        <div className="flex items-center justify-end">
                          Publications
                          {sortColumn === "publications_count" && (
                            <SortIcon direction={sortDirection} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("total_citations")}
                      >
                        <div className="flex items-center justify-end">
                          Citations
                          {sortColumn === "total_citations" && (
                            <SortIcon direction={sortDirection} />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-[var(--color-text-primary)]">
                    {sortedStats.map((discipline) => (
                      <tr key={discipline.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {discipline.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-mono font-medium text-[var(--color-primary)]">
                            {(
                              discipline.publications_count || 0
                            ).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-mono font-medium text-[var(--color-secondary)]">
                            {(discipline.total_citations || 0).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Aucune donnée disponible
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Nous n'avons trouvé aucune statistique pour le moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-gray)]">
              Données mises à jour le{" "}
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-0.5 mr-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplinesStats;
