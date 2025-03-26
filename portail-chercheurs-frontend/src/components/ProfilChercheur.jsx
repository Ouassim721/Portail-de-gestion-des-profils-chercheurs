import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProfilChercheur({ chercheur, onClose }) {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL si accès direct
  const [data, setData] = useState(chercheur || null);

  useEffect(() => {
    if (!chercheur && id) {
      // Simuler un fetch des données depuis l'API
      setData({
        id,
        nom: "Dr. Example",
        departement: "Informatique",
        publications: 12,
      });
    }
  }, [id, chercheur]);

  if (!data) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        id ? "relative bg-white p-8" : ""
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!id && (
          <button className="absolute top-2 right-2" onClick={onClose}>
            ✖
          </button>
        )}
        <h2 className="text-2xl font-bold">{data.nom}</h2>
        <p>Département : {data.departement}</p>
        <p>Publications : {data.publications}</p>
      </div>
    </div>
  );
}

export default ProfilChercheur;
