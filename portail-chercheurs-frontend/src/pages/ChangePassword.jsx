import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ChangePassword = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/change-password",
        {
          password: form.newPassword,
          password_confirmation: form.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      setSuccess("Mot de passe changé avec succès !");
      setForm({
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log("haha");

      const msg = err.response?.data?.message || "Une erreur s'est produite.";
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Changer le mot de passe
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <Button className="w-full">Enregistrer</Button>
      </form>
    </div>
  );
};

export default ChangePassword;
