export const dynamic = "force-dynamic";
import { SEMESTERS, BAMS_SUBJECTS } from "@/lib/courses";

export default async function AddExamPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Schedule New Exam</h1>
        <p className="text-gray-500 text-xs mt-0.5">Fill in the exam details below</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <form method="POST" action="/api/exams/add" className="space-y-4">

          <input type="hidden" name="course" value="BAMS" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <select name="name" required defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select...</option>
              <option value="Theory Examination">Theory Examination</option>
              <option value="Practical Examination">Practical Examination</option>
              <option value="Viva Voce">Viva Voce</option>
              <option value="Internal Assessment 1">Internal Assessment 1</option>
              <option value="Internal Assessment 2">Internal Assessment 2</option>
              <option value="Back Paper Exam">Back Paper Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Year
            </label>
            <select name="semester" defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">All Years</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select name="subject" required defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Subject...</option>
              {BAMS_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select name="exam_type" required defaultValue="theory"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="theory">Theory</option>
              <option value="internal">Internal</option>
              <option value="practical">Practical</option>
              <option value="viva">Viva</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input type="date" name="exam_date" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Marks <span className="text-red-500">*</span>
              </label>
              <input type="number" name="max_marks" required defaultValue={100} min={1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Marks <span className="text-red-500">*</span>
              </label>
              <input type="number" name="passing_marks" required defaultValue={36} min={1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <input type="text" name="academic_year" placeholder="e.g. 2025-26"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium">
              Save Exam
            </button>
            <a href="/exams"
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium text-center">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}