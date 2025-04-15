import React, { useState } from "react";
import Button from "../../components/Button";
import axios from "../../axios";

const CreateResearcher = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/admin/create-chercheur", {
        prenom: firstName,
        nom: lastName,
        email: email,
      });

      alert("Chercheur créé avec succès !");
      window.location.href = "/dashboard/adminchercheurs";
    } catch (err) {
      console.error(err);
      setError(
        "Erreur lors de la création : " + err.response?.data?.message ||
          "Erreur inconnue"
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 uppercase">
          Créer un compte Chercheur
        </h2>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleRegister}
        >
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              Prénom
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="firstName"
              type="text"
              placeholder="Prénom"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Nom
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="lastName"
              type="text"
              placeholder="Nom"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button className="w-full">Créer le compte</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResearcher;
