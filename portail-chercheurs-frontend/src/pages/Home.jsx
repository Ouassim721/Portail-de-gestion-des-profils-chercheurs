import { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { LanguageContext } from "../contexts/LanguageContext";
import ChercheurImage from "../assets/chercheurImage-HomePage.jpg";

function Home() {
  const { t } = useContext(LanguageContext);

  return (
    <>
      <section className="h-[calc(100vh-74px)] w-full bg-[var(--color-secondary)] relative">
        <div className="flex h-full justify-center lg:justify-start">
          <div className="bg-[var(--color-bg-primary)] h-full p-5 flex justify-center lg:justify-start items-center w-full lg:w-[70%]">
            <div className="flex flex-col gap-10 mb-24 items-center lg:items-start">
              <h1 className="font-bold text-4xl text-center lg:text-left max-w-125 text-[var(--color-text-primary)]">
                {t("homeTitle")}
              </h1>
              <p className="text-neutral-400 font-medium text-lg text-center lg:text-left max-w-125 xl:max-w-full">
                {t("homeSubtitle")}
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div>
                  <Link to={"/chercheurs"}>
                    <Button variant="primary">{t("exploreResearchers")}</Button>
                  </Link>
                </div>
                <div>
                  <Button variant="neutral">{t("learnMore")}</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center bg-[#111827] h-full p-5 w-[30%] relative">
            <img
              src={ChercheurImage}
              alt={t("researcherImageAlt")}
              className="absolute left-[-50%] top-16 rounded-full"
            />
          </div>
        </div>
        <div className="hidden lg:flex justify-around items-center w-full h-26 absolute bottom-0 bg-[#111827] font-bold text-white">
          <div>
            <h3 className="text-2xl">250+</h3>
            <p className="text-md text-neutral-300 font-light">{t("researchersCount")}</p>
          </div>
          <div>
            <h3 className="text-2xl">2000+</h3>
            <p className="text-md text-neutral-300 font-light">{t("publicationsCount")}</p>
          </div>
          <div>
            <h3 className="text-2xl">550+</h3>
            <p className="text-md text-neutral-300 font-light">{t("projectsCount")}</p>
          </div>
          <div>
            <h3 className="text-2xl">10+</h3>
            <p className="text-md text-neutral-300 font-light">{t("countriesCount")}</p>
          </div>
        </div>
      </section>

      <main className="flex flex-col items-center justify-center flex-grow px-6 h-[500px]">
        <h2 className="text-3xl font-bold mb-4 text-center text-[var(--color-text-primary)]">
          {t("homeWelcomeTitle")}
        </h2>
        <p className="text-lg text-center max-w-2xl text-[var(--color-text-secondary)]">
          {t("homeWelcomeText")}
        </p>
      </main>
    </>
  );
}

export default Home;