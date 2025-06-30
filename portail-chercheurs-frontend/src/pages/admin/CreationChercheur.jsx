import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

const CreateResearcher = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("admin/create-chercheur", {
        prenom: firstName,
        nom: lastName,
        email: email,
      });
      alert(t("researcherCreationSuccess"));
      navigate("/dashboard/adminchercheurs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(t("researcherCreationErrorPrefix") + (msg || t("unknownError")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 uppercase">
          {t("createResearcherTitle")}
        </h2>
        <form
          className="bg-[var(--color-bg-primary)] shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleRegister}
        >
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-[var(--color-text-secondary)] text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              {t("firstNameLabel")}
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--color-text-secondary)]"
              id="firstName"
              type="text"
              placeholder={t("firstNamePlaceholder")}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-[var(--color-text-secondary)] text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              {t("lastNameLabel")}
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--color-text-secondary)]"
              id="lastName"
              type="text"
              placeholder={t("lastNamePlaceholder")}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-[var(--color-text-secondary)] text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("emailLabel")}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--color-text-secondary)]"
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary)] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading && (
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
              )}
              {loading ? t("creating") : t("createCourse")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResearcher;
