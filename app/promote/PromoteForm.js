"use client";

import { useState } from "react";

export default function PromoteForm({ semesters, semCounts, nextAcademicYear }) {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    if (!confirm("Are you sure? This will move all students of the selected professional year to the next professional year. This cannot be undone.")) {
      e.preventDefault();
      return;
    }
    setSubmitting(true);
  }

  return (
    <form
      method="POST"
      action="/api/students/promote"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From Professional Year <span className="text-red-500">*</span>
        </label>
        <select name="from_semester" required defaultValue=""
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select professional year to promote...</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem} ({semCounts[sem] || 0} students)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To Professional Year <span className="text-red-500">*</span>
        </label>
        <select name="to_semester" required defaultValue=""
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select destination professional year...</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Academic Year <span className="text-red-500">*</span>
        </label>
        <input type="text" name="new_academic_year" required
          defaultValue={nextAcademicYear}
          placeholder="e.g. 2027-28"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      <button type="submit" disabled={submitting}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? "Promoting..." : "Promote Students →"}
      </button>
    </form>
  );
}