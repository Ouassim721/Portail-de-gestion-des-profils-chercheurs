import React, { useContext, useState } from "react";
import axios from "../axios";
import {
  FiSend,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { LanguageContext } from "../contexts/LanguageContext";
import { logError } from "@/utils/logger";

const Contact = () => {
  const { t } = useContext(LanguageContext);

  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await axios.post("/contact", { sujet, message });
      setStatus("success");
      setSujet("");
      setMessage("");
    } catch (err) {
      logError("Erreur détaillée:", err.response?.data || err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
            {t("contactTitle")}
          </h1>
          <p className="mt-3 text-xl text-gray-500">{t("contactSubtitle")}</p>
        </div>

        <div className="bg-[var(--color-bg-primary)] shadow-xl rounded-lg overflow-hidden">
          {/* Contact Information */}
          <div className="bg-[var(--color-primary)] p-6 text-[var(--color-white)]">
            <h2 className="text-2xl font-bold flex items-center">
              <FiMail className="mr-2" /> {t("contactInfoTitle")}
            </h2>
            <p className="mt-2 opacity-90">{t("contactInfoDescription")}</p>
          </div>

          {/* Contact Form */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-6 flex items-center">
              <FiMessageSquare className="mr-2 text-[var(--color-primary)]" />{" "}
              {t("sendMessageTitle")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="sujet"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
                >
                  {t("subjectLabel")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="sujet"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    required
                    className="w-full px-4 py-3 border text-[var(--color-text-primary)] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder={t("subjectPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder={t("messagePlaceholder")}
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[var(--color-primary)] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                    status === "loading" ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      {t("sendButton")}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-start">
                <FiCheckCircle className="text-green-500 text-xl mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">
                    {t("successTitle")}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {t("successMessage")}
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start">
                <FiAlertCircle className="text-red-500 text-xl mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">{t("errorTitle")}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {t("errorMessage")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-[var(--color-gray)] text-sm">
          <p>{t("responseTimeInfo")}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
