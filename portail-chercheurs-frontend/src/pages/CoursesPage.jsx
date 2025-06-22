import React, { useState, useEffect } from "react";
import CourseList from "../components/cours/CourseList";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import axios from "../axios";
import Loader from "../components/ui/Loader";

const CoursesPage = () => {
  const [researcherId, setResearcherId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/me");
        setResearcherId(res.data.id);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
        <CourseList researcherId={researcherId} />
      </div>
    </ProtectedRoute>
  );
};

export default CoursesPage;