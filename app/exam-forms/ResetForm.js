"use client";

export default function ResetForm({ id, feePaid }) {
  return (
    <form
      method="POST"
      action="/api/exam-forms/update-status"
      onSubmit={(e) => {
        if (
          !confirm(
            "Reset this form to pending? Approve/Reject फिर से करना पड़ेगा।",
          )
        )
          e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="form_status" value="pending" />
      <input type="hidden" name="exam_fee_paid" value={feePaid} />
      <button
        type="submit"
        className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg"
      >
        Reset
      </button>
    </form>
  );
}