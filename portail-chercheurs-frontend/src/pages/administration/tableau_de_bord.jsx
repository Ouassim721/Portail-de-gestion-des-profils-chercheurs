import React from 'react';
import SideMenu from '../../components/SideMenu';
import TopBar from '../../components/topbar';
import Dashboard from '../../components/Dashboard';

function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideMenu />

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

export default AdminPage;