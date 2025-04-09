import React, { useState } from "react";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MdLock,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdScience,
  MdPublic,
  MdArticle,
} from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { faSignIn, faMicroscope } from "@fortawesome/free-solid-svg-icons";
import connexionImage from "../assets/connexion.png";

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
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 relative ">
      {/* Conteneur "carré" central responsive avec effet d'ombre supplémentaire au hover */}
      <div className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden flex flex-col md:flex-row w-full max-x-[80%] md:max-x-[75%] lg:max-w-[70%] xl:max-w-[55%] h-full">
        {/* Partie gauche (informations) : cachée sur mobile */}
        <div
          className="hidden md:flex md:flex-col md:justify-center md:w-1/2 relative p-8 bg-[var(--color-primary)] bg-cover bg-center"
          style={{ backgroundImage: `url(${connexionImage})` }}
        >
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-[var(--color-primary)] opacity-80"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h1 className="mb-8 text-3xl font-extrabold text-white text-center">
                ScholarHub
              </h1>
            </div>
            <div className="flex flex-col justify-between h-1/2">
              <p className="text-indigo-100 text-lg font-light line-clamp-5">
                Gérez votre profil de recherche et connectez-vous avec la
                communauté scientifique.
              </p>
              <ul className="space-y-4 text-white">
                <li className="flex items-center gap-4">
                  <span className="bg-[rgba(255,255,255,0.1)] rounded-full flex justify-center items-center w-12 h-12">
                    <MdScience className="text-3xl text-white" />
                  </span>
                  <span>Innovation et Recherche</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-[rgba(255,255,255,0.1)] rounded-full flex justify-center items-center w-12 h-12">
                    <MdPublic className="text-3xl text-white" />
                  </span>
                  <span>Collaboration Mondiale</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-[rgba(255,255,255,0.1)] rounded-full flex justify-center items-center w-12 h-12">
                    <MdArticle className="text-3xl text-white" />
                  </span>
                  <span>Publications Scientifiques</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Partie droite (formulaire de connexion) */}
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <div className="w-full flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faMicroscope}
                  className="text-4xl text-[var(--color-primary)] bg-indigo-100 rounded-full p-3"
                />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
                Connexion Chercheur
              </h2>
              <p className="text-gray-500 text-center">
                Accédez à votre espace de recherche
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
                >
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
                    className="w-full border-none px-3 py-2 text-sm text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
                >
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
                    className="w-full border-none text-sm px-3 py-2 text-gray-700 focus:outline-none"
                    required
                  />
                  <div
                    className="absolute right-2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={24} />
                    ) : (
                      <MdVisibility size={24} />
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center cursor-pointer">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[var(--color-primary)] focus:ring-blue-900 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-700 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <Button icon={faSignIn} className="w-full p-3! font-light!">
                Se Connecter
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
