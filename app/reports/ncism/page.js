export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { students, professors, attendance, fees, results, exams, clinical_logs, internship_postings, college_settings, users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function NCISMReportPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db.select().from(users).where(eq(users.email, session.email));
  const user = userResult[0];

  const today = new Date().toISOString().split("T")[0];

  const [
    [studentCount], [professorCount],
    [presentCount], [absentCount],
    [paidFees], [pendingFees],
    [examCount], [passCount],
    [clinicalCount], [verifiedCount],
    [ongoingInternship], [completedInternship],
    settingsRows,
  ] = await Promise.all([
    db.select({ count: sql`COUNT(*)` }).from(students).where(eq(students.user_id, 1)),
    db.select({ count: sql`COUNT(*)` }).from(professors).where(eq(professors.user_id, 1)),
    db.select({ count: sql`COUNT(*)` }).from(attendance).where(sql`user_id = 1 AND status = 'present'`),
    db.select({ count: sql`COUNT(*)` }).from(attendance).where(sql`user_id = 1 AND status = 'absent'`),
    db.select({ total: sql`SUM(amount)`, count: sql`COUNT(*)` }).from(fees).where(sql`user_id = 1 AND status = 'paid'`),
    db.select({ total: sql`SUM(amount)`, count: sql`COUNT(*)` }).from(fees).where(sql`user_id = 1 AND status = 'pending'`),
    db.select({ count: sql`COUNT(*)` }).from(exams).where(eq(exams.user_id, 1)),
    db.select({ count: sql`COUNT(*)` }).from(results).where(eq(results.user_id, 1)),
    db.select({ count: sql`COUNT(*)` }).from(clinical_logs).where(eq(clinical_logs.user_id, 1)),
    db.select({ count: sql`COUNT(*)` }).from(clinical_logs).where(sql`user_id = 1 AND status = 'verified'`),
    db.select({ count: sql`COUNT(*)` }).from(internship_postings).where(sql`user_id = 1 AND status = 'ongoing'`),
    db.select({ count: sql`COUNT(*)` }).from(internship_postings).where(sql`user_id = 1 AND status = 'completed'`),
    db.select().from(college_settings).where(eq(college_settings.user_id, 1)),
  ]);

  const college = settingsRows[0] || {};
  const totalAtt = Number(presentCount?.count || 0) + Number(absentCount?.count || 0);
  const attPct = totalAtt > 0 ? ((Number(presentCount?.count) / totalAtt) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900">NCISM Compliance Report</h1>
          <p className="text-gray-500 text-xs mt-0.5">Inspection-ready summary</p>
        </div>
        <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          🖨️ Print
        </button>
      </div>

      <div id="print-area">
        {/* College Header */}
        <div className="text-center bg-green-900 text-white rounded-xl p-5 mb-5 print:rounded-none">
          {college.logo_url && <img src={college.logo_url} alt="Logo" className="h-14 w-14 object-contain mx-auto mb-2 rounded" />}
          <h2 className="text-lg font-bold uppercase">{college.college_name || "College Name"}</h2>
          {college.university_name && <p className="text-green-300 text-xs mt-0.5">{college.university_name}</p>}
          {college.affiliation_no && <p className="text-green-400 text-xs">NCISM Affiliation No: {college.affiliation_no}</p>}
          <p className="text-green-300 text-xs mt-2">NCISM Compliance Report — Generated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Total Students", value: studentCount?.count || 0, color: "green" },
            { label: "Total Faculty", value: professorCount?.count || 0, color: "green" },
            { label: "Attendance %", value: `${attPct}%`, color: attPct >= 75 ? "green" : "red" },
            { label: "Fee Collected", value: `₹${paidFees?.total || 0}`, color: "green" },
            { label: "Pending Fees", value: `₹${pendingFees?.total || 0}`, color: "yellow" },
            { label: "Total Exams", value: examCount?.count || 0, color: "green" },
            { label: "Clinical Logs", value: clinicalCount?.count || 0, color: "blue" },
            { label: "Verified Logs", value: verifiedCount?.count || 0, color: "green" },
            { label: "Internships Ongoing", value: ongoingInternship?.count || 0, color: "yellow" },
            { label: "Internships Completed", value: completedInternship?.count || 0, color: "green" },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-xl p-4 border shadow-sm border-gray-100`}>
              <p className={`text-xl font-bold text-${item.color}-600`}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* NCISM Checklist */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">📋 NCISM Inspection Checklist</h2>
          <div className="space-y-2">
            {[
              { label: "Student records maintained", ok: Number(studentCount?.count) > 0 },
              { label: "Faculty records maintained", ok: Number(professorCount?.count) > 0 },
              { label: "Attendance ≥ 75%", ok: Number(attPct) >= 75 },
              { label: "Clinical logbook entries present", ok: Number(clinicalCount?.count) > 0 },
              { label: "Clinical logs verified by faculty", ok: Number(verifiedCount?.count) > 0 },
              { label: "Internship postings recorded", ok: Number(ongoingInternship?.count) + Number(completedInternship?.count) > 0 },
              { label: "College settings configured", ok: !!college.college_name && !!college.principal_name },
              { label: "Affiliation number entered", ok: !!college.affiliation_no },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-lg ${item.ok ? "text-green-500" : "text-red-400"}`}>{item.ok ? "✓" : "✗"}</span>
                <p className={`text-sm ${item.ok ? "text-gray-700" : "text-red-600"}`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-6">
          <p>{college.college_name} · {college.address}</p>
          <p className="mt-1">Principal: {college.principal_name || "—"}</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none; }
        }
      `}</style>
    </div>
  );
}