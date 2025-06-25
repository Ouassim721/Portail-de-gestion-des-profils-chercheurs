import React, { useEffect, useState, useContext } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "react-circular-progressbar/dist/styles.css";
import { LanguageContext } from "../contexts/LanguageContext";
import { logError } from "@/utils/logger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResearcherDashboard = () => {
  const { t } = useContext(LanguageContext);

  const [profileData, setProfileData] = useState({});
  const [publications, setPublications] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [stats, setStats] = useState({
    publications: 0,
    comments: 0,
    citations: 0,
    collaborations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [disciplines, setDisciplines] = useState([]);
  const [recentCollaboration, setRecentCollaboration] = useState(null);

  // Chargement des données
  useEffect(() => {
    const fetchResearcherData = async () => {
      try {
        const [profileRes, pubsRes, followersRes, statsRes, disciplinesRes] =
          await Promise.all([
            axios.get("/me", {
              withCredentials: true,
            }),
            axios.get("/profile/publications", {
              withCredentials: true,
            }),
            axios.get("/chercheurs/followers/count", {
              withCredentials: true,
            }),
            axios.get("/chercheurs/me/stats", {
              withCredentials: true,
            }),
            axios.get("/disciplines", {
              withCredentials: true,
            }),
          ]);

        setProfileData(profileRes.data);
        setPublications(pubsRes.data?.publications || []);
        setFollowers(followersRes.data?.count || 0);
        setStats(statsRes.data || {});
        setDisciplines(disciplinesRes.data || []);
      } catch (error) {
        logError("Erreur détaillée:", error.response?.data || error.message);
        setPublications([]);
        setFollowers(0);
        setStats({
          publications: 0,
          comments: 0,
          citations: 0,
          collaborations: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResearcherData();
  }, []);

  // Calcul de la collaboration la plus récente
  useEffect(() => {
    if (!publications.length) {
      setRecentCollaboration(null);
      return;
    }

    const collaborativePubs = publications.filter((pub) => {
      const authors = pub.auteurs?.split(",").map((a) => a.trim()) || [];
      return authors.length > 1;
    });

    const sorted = collaborativePubs.sort(
      (a, b) => new Date(b.date_publication) - new Date(a.date_publication)
    );
    const mostRecent = sorted[0];
    if (!mostRecent) {
      setRecentCollaboration(null);
      return;
    }

    const currentResearcher = `${profileData.prenom} ${profileData.nom}`.trim();
    const collaborators = mostRecent.auteurs
      .split(",")
      .map((a) => a.trim())
      .filter((name) => name !== currentResearcher);

    setRecentCollaboration({
      collaborators: collaborators.join(", "),
      date: mostRecent.date_publication,
    });
  }, [publications, profileData]);

  // Construction du mapping id → nom de discipline
  const disciplineMap = disciplines.reduce((acc, d) => {
    acc[d.id] = d.nom;
    return acc;
  }, {});

  // Répartition par discipline
  const disciplineDistribution = publications.reduce((acc, pub) => {
    if (pub.disciplines && pub.disciplines.length > 0) {
      pub.disciplines.forEach((discipline) => {
        const name = discipline.nom;
        acc[name] = (acc[name] || 0) + 1;
      });
    } else {
      const noCategory = t("noCategory");
      acc[noCategory] = (acc[noCategory] || 0) + 1;
    }
    return acc;
  }, {});

  // Data pour les graphiques
  const citationsData = {
    labels:
      publications.length > 0
        ? publications.map((p) => p.titre?.substring(0, 15) + "...")
        : [t("noData")],
    datasets: [
      {
        label: t("citationsLabel"),
        data:
          publications.length > 0
            ? publications.map((p) => p.citation_count || 0)
            : [0],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const disciplinesData = {
    labels: Object.keys(disciplineDistribution),
    datasets: [
      {
        label: t("publicationsLabel"),
        data: Object.values(disciplineDistribution),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"],
      },
    ],
  };

  if (loading)
    return (
      <div className="text-center py-8">
        <Loader />
      </div>
    );

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* En-tête */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("researcherDashboardTitle")}
        </h1>
        <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
          {profileData.nom} {profileData.prenom}
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={t("publicationsLabel")}
          value={stats.publications}
          max={stats.publications + 5}
          color="#3B82F6"
        />
        <StatCard
          title={t("citationsLabel")}
          value={stats.citations}
          max={stats.citations + 10}
          color="#10B981"
        />
        <StatCard
          title={t("followersLabel")}
          value={followers}
          max={followers + 5}
          color="#F59E0B"
        />
        <StatCard
          title={t("collaborationsLabel")}
          value={stats.collaborations}
          max={stats.collaborations + 5}
          color="#6366F1"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title={t("distributionByDiscipline")}>
          <Doughnut data={disciplinesData} />
        </ChartCard>

        <ChartCard title={t("performanceOfPublications")}>
          <Bar
            data={citationsData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </ChartCard>
      </div>

      {/* Dernières activités */}
      <div
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("latestActivitiesTitle")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityItem
            title={t("lastPublicationTitle")}
            value={publications[0]?.titre}
            date={publications[0]?.date_publication}
          />
          <ActivityItem
            title={t("recentCollaborationTitle")}
            value={
              recentCollaboration?.collaborators || t("noActivityFallback")
            }
            date={recentCollaboration?.date}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, max, color }) => (
  <div
    className="p-6 rounded-xl shadow-sm text-center"
    style={{ backgroundColor: "var(--color-bg-primary)" }}
  >
    <div className="mx-auto mb-4" style={{ width: "100px", height: "100px" }}>
      <CircularProgressbar
        value={value}
        maxValue={max}
        text={`${value}`}
        styles={{
          path: { stroke: color },
          text: { fill: color, fontSize: "24px" },
        }}
      />
    </div>
    <h3 className="text-lg font-semibold" style={{ color }}>
      {title}
    </h3>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div
    className="p-6 rounded-xl shadow-sm"
    style={{ backgroundColor: "var(--color-bg-primary)" }}
  >
    <h3
      className="text-lg font-semibold mb-4"
      style={{ color: "var(--color-text-primary)" }}
    >
      {title}
    </h3>
    <div className="h-72">{children}</div>
  </div>
);

const ActivityItem = ({ title, value, date }) => (
  <div
    className="pl-4 py-2"
    style={{ borderLeft: "4px solid var(--color-primary)" }}
  >
    <p
      className="text-sm mb-1"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {title}
    </p>
    <p
      className="font-medium truncate"
      style={{ color: "var(--color-text-primary)" }}
    >
      {value || t("noActivityFallback")}
    </p>
    {date && (
      <p
        className="text-sm mt-1"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {new Date(date).toLocaleDateString("fr-FR")}
      </p>
    )}
  </div>
);

export default ResearcherDashboard;
