import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // Outlet permet d'afficher le contenu des pages

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
