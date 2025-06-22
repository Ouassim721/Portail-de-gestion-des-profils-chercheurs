import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import CourseCard from "./CourseCard";
import FiltersBar from "./FiltersBar";
import Loader from "../ui/Loader";
import Button from "../ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../contexts/LanguageContext";
import { logError } from "@/utils/logger";

const CourseList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/chercheurs/${id}/cours`);
        setCourses(response.data);
      } catch (error) {
        logError(t("errorLoadingCourses"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [id, t]);

  const handleDelete = async (courseId) => {
    if (!courseId) {
      logError(t("invalidCourseId"), courseId);
      return;
    }

    if (window.confirm(t("confirmDeleteCourse"))) {
      try {
        await api.delete(`/chercheurs/${id}/cours/${courseId}`);
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
          onClick={() => navigate(`/chercheurs/${id}/cours/new`)}
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
              researcherId={id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
