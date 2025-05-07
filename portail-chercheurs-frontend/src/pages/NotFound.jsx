import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import { LanguageContext } from "../contexts/LanguageContext";

export default function NotFound() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <>
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg-primary)] px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Titre 404 */}
          <p className="text-base font-semibold text-[var(--color-primary)]">
            404
          </p>

          {/* Titre traduit */}
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            {t("pageNotFoundTitle")}
          </h1>

          {/* Description traduite */}
          <p className="mt-6 text-lg font-medium text-gray-500 sm:text-xl/8">
            {t("pageNotFoundDesc")}
          </p>

          {/* Boutons d’action */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={() => navigate("/")}>
              {t("backToHome")}
            </Button>
            <button
              onClick={() => navigate("/contact")}
              className="text-sm font-semibold text-gray-900"
            >
              {t("contactSupport")} <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
