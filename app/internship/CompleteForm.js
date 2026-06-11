"use client";

export default function CompleteForm({ id, toStatus, label, confirmText, color }) {
  return (
    <form
      method="POST"
      action="/api/internship/complete"
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={toStatus} />
      <button
        type="submit"
        className={`text-xs font-medium px-3 py-1.5 rounded-lg ${color}`}
      >
        {label}
      </button>
    </form>
  );
}