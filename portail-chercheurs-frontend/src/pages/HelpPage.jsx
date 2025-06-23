import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";

export default function HelpPage() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  return (
    <div className="p-8 max-w-5xl mx-auto text-[var(--color-text-primary)]">
      {/* Introduction */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">
          Centre d'Aide
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          Bienvenue dans le centre d’aide du portail de gestion des profils des
          chercheurs. Cette page est conçue pour vous guider dans l’utilisation
          des fonctionnalités du portail.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          FAQ – Questions Fréquentes
        </h2>
        <ul className="space-y-6 text-[var(--color-text-secondary)]">
          <li>
            <h3 className="font-bold text-lg">❓ Comment créer mon compte ?</h3>
            <p className="text-gray-500">
              Si vous êtes un chercheur , vous devez contacter l'administrateur
              pourqu'il crée votre compte ScholarHub , après un message
              contenant l'email et mot de passe valide pour ScholarHub va être
              envoyé dans votre boîte mail.
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ Comment créer mon profil chercheur ?
            </h3>
            <p className="text-gray-500">
              Après votre première connexion, vous serez redirigé vers un
              formulaire à remplir avec vos informations de base (nom, ID
              Scopus, affiliation, etc.).
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ Comment modifier mes informations personnelles ?
            </h3>
            <p className="text-gray-500">
              Cliquez sur le bouton « Modifier » dans votre page de profil, puis
              sauvegardez vos modifications.
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ Mes publications ne s’affichent pas, que faire ?
            </h3>
            <p className="text-gray-500">
              Assurez-vous que votre ID Scopus est correct. Si le problème
              persiste, contactez un administrateur.
            </p>
          </li>
        </ul>
      </section>

      {/* Guides rapides */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Guides Rapides</h2>
        <div className="space-y-4 text-[var(--color-text-secondary)]">
          <div>
            <h3 className="font-semibold">🧾 Mise à jour du profil</h3>
            <p className="text-gray-500">
              Allez sur votre page de profil et cliquez sur le bouton
              "Modifier". Remplissez les champs nécessaires et cliquez sur
              "Enregistrer".
            </p>
          </div>
          <div>
            <h3 className="font-semibold ">📄 Ajout de publications</h3>
            <p className="text-gray-500">
              Vos publications sont importées automatiquement via l’ID Scopus.
              Sélectionnez celles que vous souhaitez afficher.
            </p>
          </div>
          <div>
            <h3 className="font-semibold ">📊 Statistiques de recherche</h3>
            <p className="text-gray-500">
              Les statistiques visibles sur votre tableau de bord se basent sur
              vos publications validées.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / feedback */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Besoin d’aide supplémentaire ?
        </h2>
        <p className="text-gray-500 mb-2">
          Si vous ne trouvez pas la réponse à votre question ici, contactez
          l’équipe d’assistance :
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="text-sm font-semibold text-[var(--color-text-primary)]"
        >
          {t("contactSupport")} <span aria-hidden="true">&rarr;</span>
        </button>{" "}
      </section>
    </div>
  );
}
