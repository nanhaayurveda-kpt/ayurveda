"use client";

import { useState } from "react";

export default function PromoteForm({ semesters, semCounts, nextAcademicYear }) {
  const [submitting, setSubmitting] = useState(false);
  const [fromSem, setFromSem] = useState("");

  const fromIndex = semesters.indexOf(fromSem);
  const toSem =
    fromIndex >= 0 && fromIndex < semesters.length - 1
      ? semesters[fromIndex + 1]
      : "";
  const isFinalYear = fromSem && !toSem;

  function handleSubmit(e) {
    if (!toSem) {
      e.preventDefault();
      return;
    }
    if (!confirm(`Promote all ${fromSem} students to ${toSem}? This cannot be undone.`)) {
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
        <select name="from_semester" required value={fromSem}
          onChange={(e) => setFromSem(e.target.value)}
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
        <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700">
          {toSem || (isFinalYear ? "—" : "Select From year first")}
        </div>
        <input type="hidden" name="to_semester" value={toSem} />
        {isFinalYear && (
          <p className="text-xs text-red-500 mt-1">
            Internship is the final year — interns pass out, they are not promoted.
          </p>
        )}
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

      <button type="submit" disabled={submitting || !toSem}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? "Promoting..." : toSem ? `Promote to ${toSem} →` : "Promote Students →"}
      </button>
    </form>
  );
}