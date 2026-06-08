export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { clinical_logs, students, professors, users } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const DEPARTMENTS = [
  "Kayachikitsa", "Shalya Tantra", "Shalakya Tantra",
  "Streeroga & Prasuti Tantra", "Kaumarbhritya", "Panchakarma",
  "Agada Tantra", "Swasthavritta", "Rasashastra",
];

export default async function ClinicalLogbookPage({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db.select().from(users).where(eq(users.email, session.email));
  const user = userResult[0];

  const params = await searchParams;
  const filterDept = params?.dept || "";
  const filterStatus = params?.status || "";

  const allLogs = await db
    .select({
      id: clinical_logs.id,
      date: clinical_logs.date,
      department: clinical_logs.department,
      case_type: clinical_logs.case_type,
      patient_age: clinical_logs.patient_age,
      diagnosis: clinical_logs.diagnosis,
      procedures: clinical_logs.procedures,
      remarks: clinical_logs.remarks,
      status: clinical_logs.status,
      student_name: students.name,
      student_id: clinical_logs.student_id,
      roll_number: students.roll_number,
      course: students.course,
      semester: students.semester,
      professor_name: professors.name,
    })
    .from(clinical_logs)
    .leftJoin(students, eq(clinical_logs.student_id, students.id))
    .leftJoin(professors, eq(clinical_logs.verified_by, professors.id))
    .where(eq(clinical_logs.user_id, 1))
    .orderBy(desc(clinical_logs.created_at));

  const filtered = allLogs.filter((l) => {
    if (filterDept && l.department !== filterDept) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    return true;
  });

  const summary = {
    total: allLogs.length,
    pending: allLogs.filter((l) => l.status === "pending").length,
    verified: allLogs.filter((l) => l.status === "verified").length,
    opd: allLogs.filter((l) => l.case_type === "opd").length,
    ipd: allLogs.filter((l) => l.case_type === "ipd").length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clinical Logbook</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {summary.total} entries · {summary.pending} pending verification
          </p>
        </div>
        <Link
          href="/clinical-logbook/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Entry
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
          <p className="text-xl font-bold text-yellow-700 mt-1">{summary.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Verified</p>
          <p className="text-xl font-bold text-green-700 mt-1">{summary.verified}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">OPD Cases</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{summary.opd}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium">IPD Cases</p>
          <p className="text-xl font-bold text-purple-700 mt-1">{summary.ipd}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {[{ value: "", label: "All Status" }, { value: "pending", label: "Pending" }, { value: "verified", label: "Verified" }].map((tab) => (
          <a
            key={tab.value}
            href={`/clinical-logbook?status=${tab.value}&dept=${filterDept}`}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              filterStatus === tab.value ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <a
          href={`/clinical-logbook?status=${filterStatus}&dept=`}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${!filterDept ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
        >
          All Depts
        </a>
        {DEPARTMENTS.map((d) => (
          <a
            key={d}
            href={`/clinical-logbook?status=${filterStatus}&dept=${encodeURIComponent(d)}`}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${filterDept === d ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {d}
          </a>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No entries found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((log) => (
            <div key={log.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{log.student_name}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      log.status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {log.status}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      log.case_type === "ipd" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {log.case_type?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{log.course} · {log.semester} · Roll: {log.roll_number || "—"}</p>
                  <p className="text-xs text-green-700 font-medium mt-1">{log.department} · {log.date}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-700"><span className="font-medium">Diagnosis:</span> {log.diagnosis}</p>
                {log.procedures && <p className="text-xs text-gray-600"><span className="font-medium">Procedures:</span> {log.procedures}</p>}
                {log.patient_age && <p className="text-xs text-gray-500">Patient Age: {log.patient_age}</p>}
                {log.remarks && <p className="text-xs text-gray-500">Remarks: {log.remarks}</p>}
                {log.professor_name && <p className="text-xs text-green-600 mt-1">✓ Verified by: {log.professor_name}</p>}
              </div>
              {log.status === "pending" && (
                <form method="POST" action="/api/clinical-logbook/verify" className="mt-2">
                  <input type="hidden" name="id" value={log.id} />
                  <button type="submit" className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-full">
                    ✓ Mark Verified
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}