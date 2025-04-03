import React, { useState } from "react";
import Button from "../components/Button";
import connexionImg from "../assets/connexion.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    setError("");
    console.log("Données envoyées :", { email, password });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Section Image - Dimensions fixes */}
      <div
        className="hidden md:flex md:w-1/2 h-full bg-gray-50 items-center justify-center p-8"
        style={{ minWidth: "696px" }}
      >
        <img
          src={connexionImg}
          alt="Interface de connexion sécurisée"
          className="w-[696px] h-[1024px] object-contain"
        />
      </div>

      {/* Section Formulaire - Centrage parfait */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 h-full">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Connexion Administrateur
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemple.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="text-right">
              <a
                href="#mot-de-passe-oublie"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center focus:outline-none focus:shadow-outline w-full"
            >
              Se Connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
