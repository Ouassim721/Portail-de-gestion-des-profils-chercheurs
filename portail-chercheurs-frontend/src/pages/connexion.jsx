import React, { useState } from "react";
import { MdLock, MdEmail, MdVisibility, MdVisibilityOff, MdScience, MdPublic, MdArticle } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import connixionImage from "../assets/connexion.png";

export default function ScholarHubLogin() {
  // États locaux pour l'email, le mot de passe et la visibilité du mot de passe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Gestion du formulaire de connexion
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion (API, etc.)
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // Bascule de la visibilité du mot de passe
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Partie gauche : informations sur ScholarHub avec image de fond et overlay */}
      <div
        className="relative hidden w-full bg-blue-900 bg-blend-overlay bg-cover bg-center p-8 text-white md:flex md:flex-col md:justify-center md:w-5/12"
        style={{ backgroundImage: `url(${connixionImage})` }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
        <div className="relative z-10">
          <h1 className="mb-8 text-3xl font-bold">ScholarHub</h1>
          <p className="mb-4 flex items-center text-xl font-semibold">
            <FaRegLightbulb className="mr-2 text-2xl" /> Gérez votre profil de recherche
          </p>
          <p className="mb-6">
            Connectez-vous avec la communauté scientifique pour collaborer, publier et échanger sur vos travaux de recherche.
          </p>
          <ul className="space-y-4">
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

      {/* Partie droite : formulaire de connexion */}
      <div className="flex w-full flex-col justify-center p-8 md:w-7/12">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="mb-8 text-2xl font-bold text-gray-700">Connexion Chercheur</h2>
          <form onSubmit={handleSubmit}>
            {/* Champ Email avec icône */}
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

            {/* Champ Mot de passe avec icône de visibilité */}
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
                {/* Icône d'œil pour voir/masquer le mot de passe */}
                <div
                  className="absolute right-2 cursor-pointer text-gray-500"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                </div>
              </div>
            </div>

            {/* Options et lien "Mot de passe oublié" */}
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
  );
}
