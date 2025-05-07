import React, { useContext } from "react";
import TopBar from "../../components/layout/topbar";
import TableauChercheur from "../../components/tables/TableauChercheur";
import { LanguageContext } from "../../contexts/LanguageContext";

function AdminPage() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu principal avec le Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          <TableauChercheur />
        </main>
      </div>
    </div>
  );
}

export default AdminPage;
