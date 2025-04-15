import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/topbar";
import Dashboard from "../../components/Dashboard";

function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/connexion");
    } else if (role !== "admin") {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
