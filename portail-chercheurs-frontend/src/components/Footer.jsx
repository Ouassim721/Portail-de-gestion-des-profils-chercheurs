import "./Footer.css"; // Import du fichier de style

const Footer = () => {
  return (
    <footer className="px-10 py-12 ">
      <div className="info flex justify-around gap-8">
        <div className="apropos ">
          <h3
            className="text-[var(--color-white)] text-2xl mb-7 font-weight: 600"
            style={{ width: "35%" }}
          >
            À propos
          </h3>
          <p className="text-[var(--color-gray)] text-sm">
            Le portail de gestion des profils des chercheurs vise à centraliser
            les publications scientifiques et à faciliter la collaboration entre
            chercheurs à travers différentes disciplines.
          </p>
        </div>
        <div className="liens">
          <h3 className="text-[var(--color-white)] text-2xl mb-7 font-weight: 600">
            Liens rapides
          </h3>
          <ul className="liens-list text-[var(--color-gray)] text-sm">
            <li>Accueil</li>
            <li>Chercheur</li>
            <li>Publication</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="contact">
          <h3 className="text-[var(--color-white)] text-2xl mb-7 font-weight: 600">
            Contact
          </h3>
          <ul className="contact-list text-[var(--color-gray)] text-sm">
            <li>📍 Université XYZ, Département de Recherche</li>
            <li>📧 contact@portail-chercheurs.com</li>
            <li>📞 +212 600 000 000</li>
          </ul>
        </div>
        <div className="suivez-nous">
          <h3 className="text-[var(--color-white)] text-2xl mb-7 font-weight: 600">
            Suivez-nous
          </h3>
          <ul className="suivez-nous-list text-[var(--color-gray)] text-sm">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
      <div className="separator my-10 mx-auto"></div>
      <div className="copyright mt-3"></div>
      <p className="text-[var(--color-gray)] text-center text-sm">
        &copy; 2025 Portail des Chercheurs. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;
