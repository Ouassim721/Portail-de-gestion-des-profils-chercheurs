import React, { useState } from "react";
import axios from "../axios";
import {
  FiSend,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const Contact = () => {
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
      console.error("Erreur détaillée:", err.response?.data || err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
            Contactez notre équipe
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Nous sommes là pour répondre à vos questions
          </p>
        </div>

        <div className="bg-[var(--color-bg-primary)] shadow-xl rounded-lg overflow-hidden">
          {/* Contact Information */}
          <div className="bg-[var(--color-primary)] p-6 text-[var(--color-white)]">
            <h2 className="text-2xl font-bold flex items-center">
              <FiMail className="mr-2" /> Informations de contact
            </h2>
            <p className="mt-2 opacity-90">
              Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>

          {/* Contact Form */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-6 flex items-center">
              <FiMessageSquare className="mr-2 text-[var(--color-primary)]" />{" "}
              Envoyer un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="sujet"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
                >
                  Sujet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="sujet"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    required
                    className="w-full px-4 py-3 border text-[var(--color-text-primary)] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Quel est l'objet de votre message ?"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Décrivez votre demande en détails..."
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
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Envoyer le message
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
                    Message envoyé avec succès !
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Nous avons bien reçu votre message et vous répondrons
                    rapidement.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start">
                <FiAlertCircle className="text-red-500 text-xl mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">
                    Erreur lors de l'envoi
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Une erreur est survenue. Veuillez réessayer plus tard.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-[var(--color-gray)] text-sm">
          <p>Nous nous engageons à vous répondre dans les 24 heures.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
