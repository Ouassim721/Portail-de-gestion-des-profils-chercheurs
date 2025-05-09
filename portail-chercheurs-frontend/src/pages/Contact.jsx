import React, { useState } from "react";
import axios from "../axios";

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
    }
  };

  return (
    <div className="my-16">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Contacter le service</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Sujet</label>
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <label className="block mb-2 font-semibold">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="6"
            className="w-full border p-2 rounded mb-4"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Envoyer
          </button>
        </form>
        {status === "success" && (
          <p className="text-green-600 mt-4">Message envoyé avec succès.</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Erreur lors de l’envoi.</p>
        )}
        {status === "loading" && (
          <p className="text-gray-600 mt-4">Envoi en cours...</p>
        )}
      </div>
    </div>
  );
};

export default Contact;
