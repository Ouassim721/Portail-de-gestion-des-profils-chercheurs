import React from "react";
import { useParams } from "react-router-dom";
import CourseList from "../components/cours/CourseList";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const CoursesPage = () => {
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
        <CourseList researcherId={id} />
      </div>
    </ProtectedRoute>
  );
};

export default CoursesPage;
