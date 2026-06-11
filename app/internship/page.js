export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { internship_postings, students, professors, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CompleteForm from "./CompleteForm";

export default async function InternshipPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, session.email));
  const user = userResult[0];

  const allPostings = await db
    .select({
      id: internship_postings.id,
      department: internship_postings.department,
      start_date: internship_postings.start_date,
      end_date: internship_postings.end_date,
      status: internship_postings.status,
      completion_note: internship_postings.completion_note,
      student_name: students.name,
      student_id: internship_postings.student_id,
      roll_number: students.roll_number,
      professor_name: professors.name,
    })
    .from(internship_postings)
    .leftJoin(students, eq(internship_postings.student_id, students.id))
    .leftJoin(professors, eq(internship_postings.supervisor_id, professors.id))
    .where(eq(internship_postings.user_id, 1))
    .orderBy(desc(internship_postings.created_at));

  const summary = {
    total: allPostings.length,
    ongoing: allPostings.filter((p) => p.status === "ongoing").length,
    completed: allPostings.filter((p) => p.status === "completed").length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Internship Tracking
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            BAMS Compulsory Rotatory Internship — 12 months
          </p>
        </div>
        <Link
          href="/internship/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Posting
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Total</p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {summary.total}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
          <p className="text-xs text-yellow-600 font-medium">Ongoing</p>
          <p className="text-xl font-bold text-yellow-700 mt-1">
            {summary.ongoing}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Completed</p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {summary.completed}
          </p>
        </div>
      </div>

      {allPostings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No internship postings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {allPostings.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">
                      {p.student_name}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        p.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 font-medium">
                    {p.department}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.start_date} → {p.end_date}
                  </p>
                  {p.professor_name && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Supervisor: {p.professor_name}
                    </p>
                  )}
                  {p.completion_note && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {p.completion_note}
                    </p>
                  )}
                </div>
                {p.status === "ongoing" ? (
                  <CompleteForm
                    id={p.id}
                    toStatus="completed"
                    label="Mark Complete"
                    confirmText={`Mark ${p.student_name}'s ${p.department} posting as completed?`}
                    color="text-green-600 bg-green-50"
                  />
                ) : (
                  <CompleteForm
                    id={p.id}
                    toStatus="ongoing"
                    label="Reopen"
                    confirmText={`Reopen ${p.student_name}'s ${p.department} posting?`}
                    color="text-gray-500 bg-gray-100"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
