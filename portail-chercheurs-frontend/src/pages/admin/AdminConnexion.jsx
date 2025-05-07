import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Titre */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t("adminLoginTitle")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              {t("emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("emailPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              {t("passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("passwordPlaceholder")}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {t("loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
