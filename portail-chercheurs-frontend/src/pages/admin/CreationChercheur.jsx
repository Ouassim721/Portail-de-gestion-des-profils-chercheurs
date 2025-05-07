import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import axios from "../../axios";
import { LanguageContext } from "../../contexts/LanguageContext";

const CreateResearcher = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("admin/create-chercheur", {
        prenom: firstName,
        nom: lastName,
        email: email,
      });
      alert(t("researcherCreationSuccess"));
      navigate("/dashboard/adminchercheurs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(
        t("researcherCreationErrorPrefix") + (msg || t("unknownError"))
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 uppercase">
          {t("createResearcherTitle")}
        </h2>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleRegister}
        >
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              {t("firstNameLabel")}
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="firstName"
              type="text"
              placeholder={t("firstNamePlaceholder")}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              {t("lastNameLabel")}
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="lastName"
              type="text"
              placeholder={t("lastNamePlaceholder")}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("emailLabel")}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button className="w-full" type="submit">
              {t("createAccountButton")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResearcher;
