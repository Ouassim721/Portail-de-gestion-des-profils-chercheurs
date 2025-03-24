import Navbar from "./Navbar";
import { Outlet } from "react-router-dom"; // Outlet permet d'afficher le contenu des pages

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Ici s'afficheront les pages selon la route actuelle */}
      </main>
    </>
  );
}

export default Layout;
