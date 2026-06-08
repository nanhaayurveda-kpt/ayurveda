import AddStudentForm from "./AddStudentForm";
import { FACULTIES, FACULTY_COURSES, SEMESTERS } from "@/lib/courses";

export default async function AddStudentPage() {
  const faculties = FACULTIES;
  const courses = FACULTY_COURSES;

  const professionalYears = SEMESTERS;
  const today = new Date().toISOString().split("T")[0];

  return (
    <AddStudentForm
      faculties={faculties}
      courses={courses}
      semesters={professionalYears}
      today={today}
    />
  );
}
