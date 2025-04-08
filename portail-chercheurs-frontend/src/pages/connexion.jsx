import React, { useState } from "react";
import { MdLock, MdEmail, MdVisibility, MdVisibilityOff, MdScience, MdPublic, MdArticle } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import connixionImage from "../assets/connexion.png";

export default function ScholarHubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    // Conteneur principal centré verticalement et horizontalement
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Conteneur "carré" central responsive avec effet d'ombre supplémentaire au hover */}
      <div className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-lg aspect-square">
        {/* Partie gauche (informations) : cachée sur mobile */}
        <div
          className="hidden md:flex md:flex-col md:justify-center md:w-1/2 relative p-8 bg-blue-900 bg-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: `url(${connixionImage})` }}
        >
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
          <div className="relative z-10">
            <h1 className="mb-8 text-3xl font-bold text-white">ScholarHub</h1>
            <p className="mb-4 flex items-center text-xl font-semibold text-white">
              <FaRegLightbulb className="mr-2 text-2xl" /> Gérez votre profil de recherche
            </p>
            <p className="mb-6 text-white">
              Connectez-vous avec la communauté scientifique pour collaborer, publier et échanger sur vos travaux de recherche.
            </p>
            <ul className="space-y-4 text-white">
              <li className="flex items-center">
                <MdScience className="mr-2 text-xl" />
                <span>Innovation et Recherche</span>
              </li>
              <li className="flex items-center">
                <MdPublic className="mr-2 text-xl" />
                <span>Collaboration Mondiale</span>
              </li>
              <li className="flex items-center">
                <MdArticle className="mr-2 text-xl" />
                <span>Publications Scientifiques</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partie droite (formulaire de connexion) */}
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <div className="w-full">
            <h2 className="mb-8 text-2xl font-bold text-gray-700 text-center">Connexion Chercheur</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email Institutionnel
                </label>
                <div className="flex items-center rounded border border-gray-300">
                  <MdEmail className="ml-2 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    placeholder="nom@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none px-3 py-2 text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative flex items-center rounded border border-gray-300">
                  <MdLock className="ml-2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none px-3 py-2 text-gray-700 focus:outline-none"
                    required
                  />
                  <div
                    className="absolute right-2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Se Connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
