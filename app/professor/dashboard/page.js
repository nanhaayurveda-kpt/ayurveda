export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { notices } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

export default async function ProfessorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("professor_session")?.value;
  if (!token) redirect("/professor-login");

  let payload;
  try {
    const verified = await jwtVerify(token, SECRET);
    payload = verified.payload;
  } catch {
    redirect("/professor-login");
  }

  const allNotices = await db
    .select()
    .from(notices)
    .where(eq(notices.user_id, 1))
    .orderBy(desc(notices.created_at))
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 px-4 py-4 flex justify-between items-center">
        <div>
          <p className="text-white font-bold">{payload.professorName}</p>
          <p className="text-green-200 text-xs">Professor Portal</p>
        </div>
        <a
          href="/api/professor-logout"
          className="text-red-300 text-sm font-medium"
        >
          Logout
        </a>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Welcome, {payload.professorName}
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/professor/attendance"
            className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="font-bold text-gray-800 text-sm">Attendance</div>
            <div className="text-gray-400 text-xs mt-1">
              Mark class attendance
            </div>
          </Link>

          <Link
            href="/professor/students"
            className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-4xl mb-2">🎓</div>
            <div className="font-bold text-gray-800 text-sm">Students</div>
            <div className="text-gray-400 text-xs mt-1">View students</div>
          </Link>

          <Link
            href="/professor/exams"
            className="bg-white rounded-xl border border-green-100 p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-4xl mb-2">📝</div>
            <div className="font-bold text-gray-800 text-sm">
              Exams & Results
            </div>
            <div className="text-gray-400 text-xs mt-1">Enter marks</div>
          </Link>
        </div>

        {allNotices.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-sm">Notices</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {allNotices.map((n) => (
                <div key={n.id} className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">
                      {n.title}
                    </p>
                    {n.priority === "urgent" && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Urgent
                      </span>
                    )}
                    {n.priority === "important" && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}