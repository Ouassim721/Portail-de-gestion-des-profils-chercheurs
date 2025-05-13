import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
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

  useEffect(() => {
    const fetchResearcherData = async () => {
      try {
        const [profileRes, pubsRes, followersRes, statsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/me", { withCredentials: true }),
          axios.get("http://localhost:8000/api/profile/publications", { withCredentials: true }),
          axios.get("http://localhost:8000/api/chercheurs/followers/count", { withCredentials: true }),
          axios.get("http://localhost:8000/api/chercheurs/me/stats", { withCredentials: true }),
        ]);

        setProfileData(profileRes.data);
        setPublications(pubsRes.data?.publications || []);
        setFollowers(followersRes.data?.count || 0);
        setStats(statsRes.data || {});
      } catch (error) {
        console.error("Erreur détaillée:", error.response?.data || error.message);
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

  const disciplineDistribution = publications.reduce((acc, pub) => {
    const discipline = pub.discipline?.nom || "Non classé";
    acc[discipline] = (acc[discipline] || 0) + 1;
    return acc;
  }, {});

  const citationsData = {
    labels: publications.length > 0 
      ? publications.map((p) => p.titre?.substring(0, 15) + "...") 
      : ["Aucune donnée"],
    datasets: [
      {
        label: "Citations par publication",
        data: publications.length > 0 ? publications.map((p) => p.citation_count || 0) : [0],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const disciplinesData = {
    labels: Object.keys(disciplineDistribution),
    datasets: [
      {
        label: "Publications par discipline",
        data: Object.values(disciplineDistribution),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"],
      },
    ],
  };

  if (loading)
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-primary)' }}>
        Chargement de vos statistiques...
      </div>
    );

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Votre tableau de bord
        </h1>
        <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          {profileData.nom} {profileData.prenom}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Publications"
          value={stats.publications}
          max={stats.publications + 5}
          color="#3B82F6"
        />
        <StatCard
          title="Citations"
          value={stats.citations}
          max={stats.citations + 10}
          color="#10B981"
        />
        <StatCard
          title="Abonnés"
          value={followers}
          max={followers + 5}
          color="#F59E0B"
        />
        <StatCard
          title="Collaborations"
          value={stats.collaborations}
          max={stats.collaborations + 5}
          color="#6366F1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Répartition par discipline">
          <Doughnut data={disciplinesData} />
        </ChartCard>

        <ChartCard title="Performances des publications">
          <Bar
            data={citationsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </ChartCard>
      </div>

      <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Dernières activités
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityItem
            title="Dernière publication"
            value={publications[0]?.titre}
            date={publications[0]?.date_publication}
          />
          <ActivityItem
            title="Collaboration la plus récente"
            value={profileData.last_collaboration?.name}
            date={profileData.last_collaboration?.date}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, max, color }) => (
  <div className="p-6 rounded-xl shadow-sm text-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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
  <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

const ActivityItem = ({ title, value, date }) => (
  <div className="pl-4 py-2" style={{ borderLeft: '4px solid var(--color-primary)' }}>
    <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
    <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
      {value || "Aucune activité"}
    </p>
    {date && (
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        {new Date(date).toLocaleDateString()}
      </p>
    )}
  </div>
);

export default ResearcherDashboard;