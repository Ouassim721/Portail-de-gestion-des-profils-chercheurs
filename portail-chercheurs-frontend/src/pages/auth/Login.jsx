// src/pages/Connexion.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faMicroscope } from "@fortawesome/free-solid-svg-icons";
import {
  MdLock,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdScience,
  MdPublic,
  MdArticle,
} from "react-icons/md";
import connexionImage from "../../assets/connexion.png";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

function Connexion() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      const user = res.data.user;
      if (user.must_change_password) {
        navigate("/change-password");
      } else if (user.role === "Administrateur") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err.response || err);
      setError(t("loginError"));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden flex flex-col md:flex-row w-full max-w-[80%] lg:max-w-[70%] xl:max-w-[55%] h-full">
        {/* Gauche - visuel */}
        <div
          className="hidden md:flex md:flex-col md:justify-center md:w-1/2 relative p-8 bg-[var(--color-primary)] bg-cover bg-center"
          style={{ backgroundImage: `url(${connexionImage})` }}
        >
          <div className="absolute inset-0 bg-[var(--color-primary)] opacity-80" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <h1 className="mb-8 text-3xl font-extrabold text-white text-center">
              {t("heroTitle")}
            </h1>
            <p className="text-indigo-100 text-lg font-light line-clamp-5">
              {t("heroText")}
            </p>
            <ul className="space-y-4 text-white">
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full w-12 h-12 flex items-center justify-center">
                  <MdScience className="text-3xl text-white" />
                </span>
                <span>{t("feature1")}</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full w-12 h-12 flex items-center justify-center">
                  <MdPublic className="text-3xl text-white" />
                </span>
                <span>{t("feature2")}</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full w-12 h-12 flex items-center justify-center">
                  <MdArticle className="text-3xl text-white" />
                </span>
                <span>{t("feature3")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Droite - formulaire */}
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <div className="w-full flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faMicroscope}
                  className="text-4xl text-[var(--color-primary)] bg-indigo-100 rounded-full p-3"
                />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
                {t("loginTitle")}
              </h2>
              <p className="text-gray-500 text-center">{t("loginSubtitle")}</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  {t("emailLabel")}
                </label>
                <div className="flex items-center rounded border border-gray-300">
                  <MdEmail className="ml-2 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none px-3 py-2 text-sm text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  {t("passwordLabel")}
                </label>
                <div className="relative flex items-center rounded border border-gray-300">
                  <MdLock className="ml-2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none px-3 py-2 text-sm text-gray-700 focus:outline-none"
                    required
                  />
                  <div
                    className="absolute right-2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={24} />
                    ) : (
                      <MdVisibility size={24} />
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center cursor-pointer">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[var(--color-primary)] focus:ring-blue-900 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                  >
                    {t("rememberMe")}
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-700 hover:underline">
                  {t("forgotPassword")}
                </a>
              </div>

              <Button icon={faSignIn} className="w-full p-3 font-light">
                {t("loginButton")}
              </Button>

              {error && (
                <p className="mt-3 text-red-500 text-center">
                  {t("loginError")}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
