import "./ProfilChercheur.css";
import Card from "./Card";
import pdp from "../assets/chercheur-place-holder.jpg";
function ProfilChercheur({ chercheur }) {
  return (
    <div className="grid grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4 mt-8">
      <section className="col-span-2 box p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <div className="flex gap-16">
          <img src={pdp} alt="Photo de profile" className="rounded-full w-32" />
          <div>
            <h2 className="text-3xl font-bold">{chercheur.nom}</h2>
            <p className="text-sm mt-1">{chercheur.departement}</p>
          </div>
        </div>
        <div className="mx-auto my-8 bg-gray-300 h-0.75 w-9/10"></div>
        <div className="flex my-3">
          <p className="w-2/5">
            <strong className="text-md">Organisations</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
            <li>Cadi Ayyad University of Marrakech</li>
          </ul>
        </div>
        <div className="flex my-6">
          <p className="w-2/5">
            <strong className="text-md">Catégories de sujets</strong>{" "}
          </p>
          <ul className="text-[var(--color-text-secondary)] ">
            <li>Computer Science</li>
            <li>Computer Science</li>
          </ul>
        </div>
      </section>
      <section className="stats row-span-3 box p-8 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]"></section>
      <section className="col-span-2 row-span-2 box p-16 rounded-2xl bg-[var(--color-white)] text-[var(--color-text-primary)]">
        <h1 className="text-2xl font-semibold mb-12 text-[var(--color-text-primary)] ml-3 ">
          Publications
        </h1>
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
        <Card
          id="P123"
          title="Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM"
          author="Dr. Jane Smith"
          cardType="publication"
        />
      </section>
    </div>
  );
}

export default ProfilChercheur;
