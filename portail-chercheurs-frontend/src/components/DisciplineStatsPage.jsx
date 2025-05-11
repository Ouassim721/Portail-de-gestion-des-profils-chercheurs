import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

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
  const [sortColumn, setSortColumn] = useState('publications_count');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/disciplines/stats', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

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
        console.error('Erreur complète:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedStats = [...stats].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortColumn === 'nom') {
      return a.nom.localeCompare(b.nom) * multiplier;
    }
    
    const valueA = a[sortColumn] || 0;
    const valueB = b[sortColumn] || 0;
    return (valueA - valueB) * multiplier;
  });

  const SortIcon = ({ direction }) => (
    <span className="ms-2">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );

  const prepareChartData = () => {
    const labels = stats.map(d => d.nom);
    
    return {
      barData: {
        labels,
        datasets: [
          {
            label: 'Publications',
            data: stats.map(d => d.publications_count || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Citations',
            data: stats.map(d => d.total_citations || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }
        ]
      },
      doughnutData: {
        labels,
        datasets: [{
          data: stats.map(d => d.publications_count || 0),
          backgroundColor: stats.map((_, i) => 
            `hsl(${(i * 360) / stats.length}, 70%, 50%)`
          ),
          borderWidth: 1
        }]
      }
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: 'Comparatif Publications/Citations par Discipline',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            return `${label}: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString()
        },
        title: {
          display: true,
          text: 'Nombre total'
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: { padding: 20 }
      },
      title: {
        display: true,
        text: 'Répartition des Publications',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3 text-muted">Chargement des statistiques...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-3 mt-3">
      <h4 className="alert-heading">Erreur de chargement</h4>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Statistiques des Disciplines</h2>
        </div>

        <div className="card-body">
          {stats.length > 0 ? (
            <>
              <div className="row g-4 mb-5">
                <div className="col-lg-8">
                  <div className="chart-container bg-white rounded-3 p-3 shadow-sm">
                    <h5 className="text-muted mb-3">Performances par discipline</h5>
                    <div style={{ height: '400px' }}>
                      <Bar data={prepareChartData().barData} options={barOptions} />
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  <div className="chart-container bg-white rounded-3 p-3 shadow-sm">
                    <h5 className="text-muted mb-3">Répartition des publications</h5>
                    <div style={{ height: '300px' }}>
                      <Doughnut 
                        data={prepareChartData().doughnutData} 
                        options={doughnutOptions} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive rounded-3 shadow-sm mt-4">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th 
                        className="ps-4 cursor-pointer"
                        onClick={() => handleSort('nom')}
                      >
                        Discipline
                        {sortColumn === 'nom' && <SortIcon direction={sortDirection} />}
                      </th>
                      <th 
                        className="text-end cursor-pointer"
                        onClick={() => handleSort('publications_count')}
                      >
                        Publications
                        {sortColumn === 'publications_count' && <SortIcon direction={sortDirection} />}
                      </th>
                      <th 
                        className="text-end pe-4 cursor-pointer"
                        onClick={() => handleSort('total_citations')}
                      >
                        Citations
                        {sortColumn === 'total_citations' && <SortIcon direction={sortDirection} />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStats.map(discipline => (
                      <tr key={discipline.id} className="hover-row">
                        <td className="ps-4 fw-medium text-dark">{discipline.nom}</td>
                        <td className="text-end font-monospace">
                          {(discipline.publications_count || 0).toLocaleString()}
                        </td>
                        <td className="text-end pe-4 font-monospace">
                          {(discipline.total_citations || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-muted small">
                * Cliquez sur les en-têtes pour trier le tableau
              </div>
            </>
          ) : (
            <div className="alert alert-warning m-0">
              Aucune donnée disponible pour le moment
            </div>
          )}
        </div>

        <div className="card-footer bg-light">
          <small className="text-muted">
            Données mises à jour en temps réel - {new Date().toLocaleDateString()}
          </small>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .hover-row { 
          transition: all 0.2s ease; 
          background-color: rgba(105, 147, 189, 0.5);
        }
        .hover-row:hover { 
          background-color: #f8f9fa !important; 
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .font-monospace { 
          font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
          font-weight: 500;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default DisciplinesStats;