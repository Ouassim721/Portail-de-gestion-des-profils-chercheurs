import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // Outlet permet d'afficher le contenu des pages

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Ici s'afficheront les pages selon la route actuelle */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
