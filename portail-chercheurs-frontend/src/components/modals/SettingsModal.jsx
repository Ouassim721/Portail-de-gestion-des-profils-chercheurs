import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../contexts/LanguageContext";

const SettingsModal = ({ show, onClose, onLanguageChange }) => {
  const { language, t, availableLanguages } = useContext(LanguageContext);
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (themeValue === "light" || themeValue === "dark") {
      root.classList.add(themeValue);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.add(systemPrefersDark ? "dark" : "light");
    }
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    applyTheme(value);
  };

  const handleLanguageChange = (newLang) => {
    onLanguageChange(newLang);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] modal-overlay"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md relative"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("settings")}</h2>
          <button
            onClick={onClose}
            className="hover:text-[var(--color-primary)] transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label={t("close")}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-3 font-medium">{t("appearance")}</label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full p-2.5 rounded-lg focus:ring-2"
              style={{
                border: "1px solid var(--color-gray)",
                backgroundColor: "var(--color-bg-secondary)",
              }}
            >
              <option value="light">{t("lightTheme")}</option>
              <option value="dark">{t("darkTheme")}</option>
              <option value="system">{t("systemTheme")}</option>
            </select>
          </div>

          <div>
            <label className="block mb-3 font-medium">{t("language")}</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2.5 rounded-lg focus:ring-2"
              style={{
                border: "1px solid var(--color-gray)",
                backgroundColor: "var(--color-bg-secondary)",
              }}
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {t(lang === "fr" ? "french" : "english")}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-white)",
            }}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
