import React, { useState, useEffect, useContext } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { LanguageContext } from "../contexts/LanguageContext";
import { logError } from "@/utils/logger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const PedagogicalStatsPage = () => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/stats/pedagogical",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `${t("errorStatus")} ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        logError(t("errorOccurred"), err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const prepareTopMatieresData = () => {
    if (!stats || !stats.topMatieres) return null;

    return {
      labels: stats.topMatieres.map((m) => m.nom_matiere),
      datasets: [
        {
          label: t("courses"),
          data: stats.topMatieres.map((m) => m.cours_count),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const prepareTopChercheursData = () => {
    if (!stats || !stats.topChercheurs) return null;

    return {
      labels: stats.topChercheurs.map((c) => `${c.prenom} ${c.nom}`),
      datasets: [
        {
          label: t("courses"),
          data: stats.topChercheurs.map((c) => c.cours_count),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const prepareCoursParMoisData = () => {
    if (!stats || !stats.coursParMois) return null;

    const formatter = new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      year: "numeric",
    });

    const labels = stats.coursParMois.map((item) => {
      const [year, month] = item.mois.split("-");
      const date = new Date(year, month - 1);
      return formatter.format(date);
    });

    return {
      labels,
      datasets: [
        {
          label: t("publishedCourses"),
          data: stats.coursParMois.map((item) => item.total),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const prepareCoursParMatiereData = () => {
    if (!stats || !stats.coursParMatiere) return null;

    const top10 = stats.coursParMatiere.slice(0, 10);

    return {
      labels: top10.map((m) => m.nom_matiere),
      datasets: [
        {
          data: top10.map((m) => m.cours_count),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8AC926",
            "#1982C4",
            "#6A4C93",
            "#F15BB5",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">
            {t("loadingPedStats")}
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-6">
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
                {t("errorLoading")}
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
      <div className="rounded-lg overflow-hidden shadow-xl">
        <div className="px-6 py-5">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("pedStatsTitle")}
          </h2>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {t("pedStatsSubtitle")}
          </p>
        </div>

        <div className="px-6 py-5">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-indigo-50">
                {t("totalSubjects")}
              </h3>
              <p className="text-3xl font-bold mt-2">{stats.totalMatieres}</p>
              <p className="text-sm text-indigo-50 mt-1">{t("subjects")}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-green-50">
                {t("totalCourses")}
              </h3>
              <p className="text-3xl font-bold  mt-2">{stats.totalCours}</p>
              <p className="text-sm text-green-50 mt-1">{t("courses")}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-purple-50">
                {t("activeTeachers")}
              </h3>
              <p className="text-3xl font-bold mt-2">
                {stats.chercheursAvecCours}
              </p>
              <p className="text-sm text-purple-50 mt-1">{t("teachers")}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-4">{t("topSubjects")}</h3>
              <div className="h-80">
                <Bar data={prepareTopMatieresData()} options={barOptions} />
              </div>
            </div>

            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-4">
                {t("distributionBySubject")}
              </h3>
              <div className="h-80">
                <Pie data={prepareCoursParMatiereData()} options={pieOptions} />
              </div>
            </div>

            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-4">{t("topTeachers")}</h3>
              <div className="h-80">
                <Bar data={prepareTopChercheursData()} options={barOptions} />
              </div>
            </div>

            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-4">
                {t("monthlyTrend")}
              </h3>
              <div className="h-80">
                <Line data={prepareCoursParMoisData()} options={lineOptions} />
              </div>
            </div>
          </div>

          {/* Subjects detail table */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{t("subjectsDetail")}</h3>
              <span className="text-sm text-gray-500">
                {stats.coursParMatiere.length} {t("subject").toLowerCase()}
                {stats.coursParMatiere.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t("subject")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      {t("courses")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      {t("percentage")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.coursParMatiere.map((matiere, index) => (
                    <tr
                      key={index}
                      className={
                        "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {matiere.nom_matiere}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-mono font-medium text-indigo-600">
                          {matiere.cours_count}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (matiere.cours_count / stats.totalCours) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="ml-3 text-sm font-medium text-gray-500">
                            {(
                              (matiere.cours_count / stats.totalCours) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teachers detail table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{t("teachersDetail")}</h3>
              <span className="text-sm text-gray-500">
                {stats.topChercheurs.length} {t("teacher").toLowerCase()}
                {stats.topChercheurs.length !== 1 ? "s" : ""} {t("active")}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t("teacher")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      {t("publishedCourses")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      {t("subjectsTaught")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topChercheurs.map((chercheur, index) => (
                    <tr
                      key={index}
                      className={
                        "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {chercheur.prenom} {chercheur.nom}
                            </div>
                            <div className="text-sm text-[var(--color-text-secondary)]">
                              {chercheur.specialisation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {chercheur.cours_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">
                        {chercheur.matieres_count || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedagogicalStatsPage;
