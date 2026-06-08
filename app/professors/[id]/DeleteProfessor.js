"use client";

export default function DeleteProfessor({ professorId, professorName }) {
  return (
    <form
      method="POST"
      action="/api/professors/delete"
      onSubmit={(e) => {
        if (!confirm(`Delete ${professorName}?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={professorId} />
      <button
        type="submit"
        className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium"
      >
        🗑 Delete Professor
      </button>
    </form>
  );
}