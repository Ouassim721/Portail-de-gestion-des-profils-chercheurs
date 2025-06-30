import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import CourseCard from "./CourseCard";
import FiltersBar from "./FiltersBar";
import Loader from "../ui/Loader";
import Button from "../ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";
import axios from "../../axios"; // Ajout d'axios

const CourseList = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  
  const [researcherId, setResearcherId] = useState(null); // Nouvel état pour l'ID du chercheur
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'ID de l'utilisateur connecté
        const userRes = await axios.get("/me");
        const userId = userRes.data.id;
        setResearcherId(userId);
        
        // Récupérer les cours de l'utilisateur
        const coursesRes = await api.get(`/chercheurs/${userId}/cours`);
        setCourses(coursesRes.data);
      } catch (error) {
        logError(t("errorLoadingCourses"), error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndCourses();
  }, [t]);

  const handleDelete = async (courseId) => {
    if (!courseId) {
      logError(t("invalidCourseId"), courseId);
      return;
    }

    if (window.confirm(t("confirmDeleteCourse"))) {
      try {
        await api.delete(`/chercheurs/${researcherId}/cours/${courseId}`);
        setCourses((prev) => prev.filter((c) => c.id_cours !== courseId));
      } catch (error) {
        logError(t("errorDeletingCourse"), error);
        alert(
          t("errorDeleteCourseMsg", {
            message: error.response?.data?.message || error.message,
          })
        );
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.titre?.toLowerCase().includes(filter.toLowerCase()) ||
      course.description?.toLowerCase().includes(filter.toLowerCase());

    const matchesSubject = selectedSubject
      ? course.matiere?.id_matiere === Number(selectedSubject)
      : true;

    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {t("myCourses")}
        </h1>
        
        <Button
          icon={faPlus}
          onClick={() => navigate(`/mes-cours/new`)}
        >
          {t("newCourse")}
        </Button>
      </div>

      <FiltersBar
        filter={filter}
        setFilter={setFilter}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        courses={courses}
      />

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-bg-primary)] rounded-lg shadow">
          <h3 className="mt-4 text-xl font-medium text-[var(--color-text-primary)]">
            {t("noCoursesFound")}
          </h3>
          <p className="mt-2 text-[var(--color-gray)]">
            {t("tryChangeFiltersOrCreate")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id_cours}
              course={course}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;