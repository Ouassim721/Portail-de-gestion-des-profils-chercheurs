import { useState, useEffect, useContext } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from "../axios";
import { LanguageContext } from "../contexts/LanguageContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({
    chercheurs: null,
    publications: null,
    chartData: { chercheurs: [], publications: [] },
  });
  const [disciplinesData, setDisciplinesData] = useState({
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateChartData = (rawData) => {
    const currentYear = new Date().getFullYear();
    const chercheursData = getLastSixMonths().map((month) => {
      const match = rawData.find(
        (item) => item.month === month + 1 && item.year === currentYear
      );
      return match?.count || 0;
    });
    
    const publicationsData = chercheursData.map(c => Math.round(c * 0.8));
    
    return { chercheurs: chercheursData, publications: publicationsData };
  };

  const getLastSixMonths = () => {
    const months = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      months.push(new Date(date.getFullYear(), date.getMonth() - i).getMonth());
    }
    return months;
  };

  const getMonthLabels = () => {
    const monthKeys = [
      "monthJan", "monthFeb", "monthMar",
      "monthApr", "monthMay", "monthJun",
      "monthJul", "monthAug", "monthSep",
      "monthOct", "monthNov", "monthDec"
    ];
    return getLastSixMonths().map(m => t(monthKeys[m]));
  };

  const processDisciplinesData = (chercheurs) => {
    const disciplineCounts = {};
    chercheurs.forEach((chercheur) => {
      const discipline = chercheur.discipline || t("unknownDiscipline");
      const count = chercheur.publications_count || 0;
      disciplineCounts[discipline] = (disciplineCounts[discipline] || 0) + count;
    });

    return {
      labels: Object.keys(disciplineCounts),
      data: Object.values(disciplineCounts),
    };
  };

  const generateColors = (count) => {
    const baseColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(249, 115, 22, 0.8)',
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chercheursRes, chercheursDataRes] = await Promise.all([
          axios.get("/stats"),
          axios.get("/stats/chercheurs"),
          axios.get("/chercheurs?per_page=1000"),
        ]);

        setStats({
          chercheurs: statsRes.data.chercheurs,
          publications: statsRes.data.publications,
          chartData: generateChartData(chercheursRes.data),
        });

        setDisciplinesData(processDisciplinesData(chercheursDataRes.data.data));
        setLoading(false);
      } catch (err) {
        setError(t("errorLoadingData"));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`p-6 bg-white rounded-xl shadow-sm border border-${color}-100 transition-all hover:shadow-md`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <svg className={`w-8 h-8 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-600">{title}</h3>
          <p className="mt-2 text-4xl font-bold text-gray-900">
            {value !== null ? value.toLocaleString() : "..."}
          </p>
        </div>
      </div>
    </div>
  );

  const chartConfig = {
    labels: getMonthLabels(),
    datasets: [
      {
        type: 'line',
        label: t("statResearchers"),
        data: stats.chartData.chercheurs,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: t("statPublications"),
        data: stats.chartData.publications,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
      }
    ],
  };

  const pieChartConfig = {
    labels: disciplinesData.labels,
    datasets: [{
      data: disciplinesData.data,
      backgroundColor: generateColors(disciplinesData.labels.length),
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: { 
        display: true, 
        text: t("monthlyActivity"),
        font: { size: 16 }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        title: { display: true, text: t("researchers") }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: t("publications") }
      },
      x: {
        grid: { display: false },
        ticks: { padding: 10 }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'right',
        labels: { padding: 20 }
      },
      title: { 
        display: true, 
        text: t("publicationDistribution"),
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={t("statPublications")}
          value={stats.publications}
          color="blue"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
        <StatCard
          title={t("statResearchers")}
          value={stats.chercheurs}
          color="green"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-96">
            <Bar data={chartConfig} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-96">
            <Pie data={pieChartConfig} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-400 mr-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;