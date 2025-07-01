import React, { useState, useContext } from "react";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

const MotDePasseOublie = () => {
  const { t } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/forgot-password", { email });
      setMessage(t("resetLinkSent"));
      setIsError(false);
    } catch {
      setMessage(t("resetLinkError"));
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("forgotPasswordTitle")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("forgotPasswordSubtitle")}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("emailLabel")}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("sendResetLink")}
              </button>
            </div>

            {message && (
              <div
                className={`rounded-md p-4 ${
                  isError ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isError ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MotDePasseOublie;