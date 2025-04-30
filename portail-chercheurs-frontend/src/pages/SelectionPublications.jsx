import React, { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/ui/Button";

const SelectionPublications = () => {
  const [publications, setPublications] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get(`/chercheur/publications`, {
        withCredentials: true,
      })
      .then((res) => {
        // si les données sont sous forme res.data.results
        console.log("resultat : ");
        console.log(res.data);

        const pubs =
          res.data.results || res.data["search-results"]?.entry || [];
        setPublications(pubs);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des publications:", err);
        setPublications([]); // fallback pour éviter le crash
      });
  }, []);

  const handleCheck = (pub) => {
    if (selected.find((p) => p["dc:identifier"] === pub["dc:identifier"])) {
      setSelected(
        selected.filter((p) => p["dc:identifier"] !== pub["dc:identifier"])
      );
    } else {
      setSelected([...selected, pub]);
    }
  };

  const handleSave = () => {
    const formatted = selected.map((pub) => ({
      titre: pub["dc:title"],
      date_publication: pub["prism:coverDate"],
      auteurs: pub["dc:creator"],
      abstract: pub["dc:description"],
      citation_count: pub["citedby-count"],
    }));

    axios
      .post(
        "/chercheur/publications",
        { publications: formatted },
        { withCredentials: true }
      )
      .then(() => alert("Publications sauvegardées avec succès."))
      .catch((err) => console.error("Erreur :", err));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Sélectionnez vos publications</h2>
      <div className="grid gap-4">
        {publications.map((pub) => (
          <div
            key={pub["dc:identifier"]}
            className="border p-4 rounded-lg shadow-sm"
          >
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                onChange={() => handleCheck(pub)}
                checked={selected.some(
                  (p) => p["dc:identifier"] === pub["dc:identifier"]
                )}
              />
              <div>
                <p className="font-semibold">{pub["dc:title"]}</p>
                <p className="text-sm text-gray-600">{pub["dc:creator"]}</p>
                <p className="text-sm italic">{pub["prism:coverDate"]}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={handleSave} className="my-3">
        {" "}
        Enregistrer les sélections
      </Button>
    </div>
  );
};

export default SelectionPublications;
