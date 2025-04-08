import Button from "../components/Button";
import { Link } from "react-router-dom";

import ChercheurImage from "../assets/chercheurImage-HomePage.jpg";
function Home() {
  return (
    <>
      {/* Contenu principal */}
      <section className="h-[calc(100vh-74px)] w-full bg-[var(--color-secondary)] relative ">
        <div className="flex h-full justify-center lg:justify-start">
          <div className="bg-[var(--color-white)] h-full p-5 flex justify-center lg:justify-start  items-center w-full lg:w-[70%]">
            <div className="flex flex-col gap-10 mb-24 items-center lg:items-start">
              <h1 className="font-bold text-4xl text-center lg:text-left max-w-125">
                Facilitez l’Accès aux Profils de Recherche
              </h1>
              <p className="text-neutral-400 font-semibold text-lg text-center lg:text-left max-w-125 xl:max-w-full">
                Trouvez facilement les informations des chercheurs et leurs
                travaux scientifiques.
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div>
                  <Link to={"/chercheurs"}>
                    <Button variant="primary">Explorer les Chercheurs</Button>
                  </Link>
                </div>
                <div>
                  <Button variant="neutral">En savoir plus</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center bg-[var(--color-primary)] h-full p-5 w-[30%] relative">
            <img
              src={ChercheurImage}
              alt="Chercheur Image"
              className="absolute left-[-50%] top-16 rounded-full"
            />
          </div>
        </div>
        <div className="hidden lg:flex justify-around items-center w-full h-26 absolute bottom-0 bg-[var(--color-primary)] font-bold text-white">
          <div>
            <h3 className="text-2xl">250+</h3>
            <p className="text-md text-neutral-300 font-light">Chercheurs</p>
          </div>{" "}
          <div>
            <h3 className="text-2xl">2000+</h3>
            <p className="text-md text-neutral-300 font-light">Publications</p>
          </div>{" "}
          <div>
            <h3 className="text-2xl">550+</h3>
            <p className="text-md text-neutral-300 font-light">Projets</p>
          </div>{" "}
          <div>
            <h3 className="text-2xl">10+</h3>
            <p className="text-md text-neutral-300 font-light">Pays</p>
          </div>
        </div>
      </section>
      <main className="flex flex-col items-center justify-center flex-grow px-6 h-[500px]">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Bienvenue sur le Portail des Chercheurs [Page en cours de
          développement]
        </h2>
        <p className="text-gray-700 text-lg text-center max-w-2xl">
          Accédez aux profils des chercheurs, découvrez leurs travaux et
          explorez les collaborations possibles.
        </p>
      </main>
    </>
  ); // Contenu de la page Home
}

export default Home;
