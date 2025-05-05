// src/pages/CompleteProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const MAX_CV_SIZE = 2 * 1024 * 1024; // 2 Mo

const CompleteProfile = () => {
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    email: "",
    discipline: "",
    scopus_author_id: "",
  });
  const [files, setFiles] = useState({ cv: null, photoProfil: null });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile", {
        withCredentials: true,
      })
      .then((res) => {
        setProfile({
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          discipline: res.data.discipline || "",
          scopus_author_id: res.data.scopus_author_id || "",
        });
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const { name, files: f } = e.target;
    setFiles((prev) => ({ ...prev, [name]: f[0] }));
    setErrors({ ...errors, [name]: null });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!profile.discipline.trim()) {
      validationErrors.discipline = "La discipline est requise.";
    }
    if (files.cv && files.cv.size > MAX_CV_SIZE) {
      validationErrors.cv = "Le CV ne doit pas dépasser 2 Mo.";
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("discipline", profile.discipline);
    formData.append("scopus_author_id", profile.scopus_author_id);
    if (files.cv) formData.append("cv", files.cv);
    if (files.photoProfil) formData.append("photoProfil", files.photoProfil);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/complete-profile",
        {
          withCredentials: true,
        }
      );
      setSuccess(res.data.message || "Profil mis à jour !");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      // gère erreurs 422 et autres
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({
          general: err.response?.data?.message || "Erreur serveur.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Compléter votre profil
      </h2>

      <div className="space-y-4 mb-6">
        {["nom", "prenom", "email"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={profile[field]}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        ))}
      </div>

      {errors.general && (
        <p className="text-red-600 text-sm mb-4">{errors.general}</p>
      )}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block text-gray-700 mb-1">Discipline *</label>
          <input
            type="text"
            name="discipline"
            value={profile.discipline}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              errors.discipline
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.discipline && (
            <p className="text-red-600 text-sm mt-1">{errors.discipline}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Scopus Author ID</label>
          <input
            type="text"
            name="scopus_author_id"
            value={profile.scopus_author_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">CV (PDF, ≤ 2 Mo)</label>
          <input
            type="file"
            name="cv"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-gray-700"
          />
          {errors.cv && (
            <p className="text-red-600 text-sm mt-1">{errors.cv}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Photo de profil (≤ 2 Mo)
          </label>
          <input
            type="file"
            name="photoProfil"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-700"
          />
          {files.photoProfil && (
            <img
              src={URL.createObjectURL(files.photoProfil)}
              alt="Aperçu"
              className="mt-2 h-24 w-24 object-cover rounded-full border"
            />
          )}
          {errors.photoProfil && (
            <p className="text-red-600 text-sm mt-1">{errors.photoProfil}</p>
          )}
        </div>

        <Button disabled={loading} className="w-full">
          {loading ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
};

export default CompleteProfile;
