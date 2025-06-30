import React from "react";
import CourseList from "../components/cours/CourseList";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const CoursesPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
        <CourseList />
      </div>
    </ProtectedRoute>
  );
};

export default CoursesPage;