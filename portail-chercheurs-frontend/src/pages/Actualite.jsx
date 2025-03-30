import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faSliders } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "../components/DropdownButton";
import Pagination from "../components/Pagination";
import Card from "../components/Card";

const Actualite = () => {
  const fakeData = [
    {
      id: "P123",
      title:
        "Human Emotion Recognition Based on Spatio-Temporal Facial Features Using HOG-HOF and VGG-LSTM",
      author: "Dr. Jane Smith",
      cardType: "actualite",
    },
    {
      id: "P124",
      title: "Advancements in Machine Learning for Natural Language Processing",
      author: "Prof. John Doe",
      cardType: "actualite",
    },
    {
      id: "P125",
      title: "Exploring Quantum Computing: The Future of Computing Technology",
      author: "Dr. Alice Brown",
      cardType: "actualite",
    },
    {
      id: "P126",
      title: "Artificial Intelligence and Its Impact on Healthcare Industry",
      author: "Dr. Robert Johnson",
      cardType: "actualite",
    },
    {
      id: "P127",
      title: "The Role of Blockchain in Revolutionizing Financial Systems",
      author: "Prof. Sarah Lee",
      cardType: "actualite",
    },
    {
      id: "P128",
      title: "Autonomous Vehicles: Challenges and Future Directions",
      author: "Dr. James Wilson",
      cardType: "actualite",
    },
    {
      id: "P129",
      title: "The Evolution of Deep Learning in Image Recognition",
      author: "Dr. Emily Clark",
      cardType: "actualite",
    },
    {
      id: "P130",
      title: "Natural Language Processing: Techniques and Applications",
      author: "Prof. William Harris",
      cardType: "actualite",
    },
    {
      id: "P131",
      title: "Exploring the Internet of Things (IoT) in Smart Cities",
      author: "Dr. Mark Lewis",
      cardType: "actualite",
    },
    {
      id: "P132",
      title: "The Future of Cybersecurity in the Age of AI",
      author: "Dr. Olivia Martinez",
      cardType: "actualite",
    },
    {
      id: "P133",
      title: "The Impact of 5G Networks on Modern Communication Systems",
      author: "Prof. David Thomas",
      cardType: "actualite",
    },
    {
      id: "P134",
      title: "The Role of Data Science in Business Decision-Making",
      author: "Dr. Jennifer Taylor",
      cardType: "actualite",
    },
    {
      id: "P135",
      title: "Advancements in Artificial Intelligence for Robotics",
      author: "Prof. Kevin Moore",
      cardType: "actualite",
    },
    {
      id: "P136",
      title: "Big Data and Its Influence on Predictive Analytics",
      author: "Dr. Michelle White",
      cardType: "actualite",
    },
    {
      id: "P137",
      title: "Exploring the Potential of Augmented Reality in Education",
      author: "Prof. Christopher Walker",
      cardType: "actualite",
    },
    {
      id: "P138",
      title: "The Intersection of AI and Climate Change Solutions",
      author: "Dr. Lisa Scott",
      cardType: "actualite",
    },
    {
      id: "P139",
      title: "Cybersecurity Trends: Protecting the Digital Economy",
      author: "Prof. Mark Anderson",
      cardType: "actualite",
    },
    {
      id: "P140",
      title: "Machine Learning in Predictive Maintenance for Manufacturing",
      author: "Dr. Patricia King",
      cardType: "actualite",
    },
    {
      id: "P141",
      title: "The Role of AI in Personalized Healthcare Treatments",
      author: "Dr. Brian Scott",
      cardType: "actualite",
    },
    {
      id: "P142",
      title: "AI in Space Exploration: Changing the Future of Astronomy",
      author: "Prof. Daniel Lee",
      cardType: "actualite",
    },
    {
      id: "P143",
      title: "Exploring Data Privacy and Ethical Issues in AI",
      author: "Dr. Rachel Adams",
      cardType: "actualite",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const actualitePerPage = 9;

  const totalPages = Math.ceil(fakeData.length / actualitePerPage);

  // État pour les données de l'API
  const [cardsData, setCardsData] = useState([]);

  // Simuler une récupération de données avec useEffect (remplacer par un fetch réel)
  useEffect(() => {
    // Simule une récupération des données d'une API
    setTimeout(() => {
      setCardsData(fakeData); // Ici, tu remplacerais fakeData par la réponse de l'API
    }, 1000);
  }, []);

  // Calcul des cartes à afficher pour la page actuelle
  const currentCards = cardsData.slice(
    (currentPage - 1) * actualitePerPage,
    currentPage * actualitePerPage
  );

  return (
    <>
      <div className="actualite">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center mx-12 sm:mx-28 xl:mx-38 mt-12">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
            Actualités
          </h1>
          {/*
          <DropdownButton
            icon={faSliders}
            children="Filtrer"
            variant="neutral"
            options={[
              {
                label: "Date",
                onClick: () => console.log("Nom"),
              },
              {
                label: "Titre",
                onClick: () => console.log("Département"),
              },
            ]}
          />
          */}
        </div>
        <div className="mx-auto mt-8 mb-12 bg-gray-300 h-0.5 w-3/4"></div>
        <section>
          <div className="text-[var(--color-text-primary)] grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mx-35">
            {currentCards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                author={card.author}
                cardType={card.cardType}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </>
  );
};

export default Actualite;
