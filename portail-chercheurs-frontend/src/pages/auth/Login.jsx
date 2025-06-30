import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MdLock,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdScience,
  MdPublic,
  MdArticle,
} from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { faSignIn, faMicroscope } from "@fortawesome/free-solid-svg-icons";
import connexionImage from "../../assets/connexion.png";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

function Connexion() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/login",
        { email, password, remember },
        { withCredentials: true }
      );
      const user = res.data.user;
      if (user?.must_change_password) {
        navigate("/change-password");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] p-4">
      <div className="bg-[var(--color-bg-primary)] shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-full">
        {/* Info panel */}
        <div
          className="hidden md:flex md:flex-col md:justify-center md:w-1/2 relative p-8 bg-[var(--color-primary)] bg-cover bg-center"
          style={{ backgroundImage: `url(${connexionImage})` }}
        >
          <div className="absolute inset-0 bg-[#003366] opacity-80" />
          <div className="relative z-10 flex-grow flex flex-col justify-between">
            <h1 className="text-3xl font-extrabold text-white text-center">
              ScholarHub
            </h1>
            <p className="text-indigo-100 text-lg font-light">
              {t("heroText")}
            </p>
            <ul className="space-y-4 text-white">
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full p-3">
                  <MdScience className="text-3xl" />
                </span>
                {t("feature1")}
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full p-3">
                  <MdPublic className="text-3xl" />
                </span>
                {t("feature2")}
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-[rgba(255,255,255,0.1)] rounded-full p-3">
                  <MdArticle className="text-3xl" />
                </span>
                {t("feature3")}
              </li>
            </ul>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <FontAwesomeIcon
                icon={faMicroscope}
                className="text-4xl text-[var(--color-primary)] bg-indigo-100 rounded-full p-3"
              />
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {t("loginTitle")}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t("loginSubtitle")}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("emailLabel")}
                </label>
                <div className="flex items-center rounded border border-gray-300">
                  <MdEmail className="ml-2 text-[var(--color-text-primary)]" />
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("passwordLabel")}
                </label>
                <div className="relative flex items-center rounded border border-gray-300">
                  <MdLock className="ml-2 text-[var(--color-text-primary)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
                    required
                  />
                  <div
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 cursor-pointer text-[var(--color-text-secondary)]"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Remember & forgot */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label
                    className="text-[var(--color-text-primary)]"
                    htmlFor="rememberMe"
                  >
                    {t("rememberMe")}
                  </label>
                </div>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Submit */}
              <Button
                className={`w-full ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("login")}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignIn} className="mr-2" />
                    {t("loginButton")}
                  </>
                )}
              </Button>

              {/* Error */}
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
