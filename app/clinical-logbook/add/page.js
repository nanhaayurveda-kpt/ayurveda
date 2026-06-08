export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { students, professors, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const DEPARTMENTS = [
  "Kayachikitsa", "Shalya Tantra", "Shalakya Tantra",
  "Streeroga & Prasuti Tantra", "Kaumarbhritya", "Panchakarma",
  "Agada Tantra", "Swasthavritta", "Rasashastra",
];

export default async function AddClinicalLogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db.select().from(users).where(eq(users.email, session.email));
  const user = userResult[0];

  const allStudents = await db.select({ id: students.id, name: students.name, course: students.course, semester: students.semester, roll_number: students.roll_number })
    .from(students).where(eq(students.user_id, 1)).orderBy(students.name);

  const allProfessors = await db.select({ id: professors.id, name: professors.name })
    .from(professors).where(eq(professors.user_id, 1)).orderBy(professors.name);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Add Clinical Log</h1>
        <p className="text-gray-500 text-xs mt-0.5">NCISM e-Logbook Entry</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <form method="POST" action="/api/clinical-logbook/add" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student <span className="text-red-500">*</span></label>
            <select name="student_id" required defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Student...</option>
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.course} {s.semester || ""} · Roll {s.roll_number || "—"}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" name="date" required defaultValue={today} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Type <span className="text-red-500">*</span></label>
              <select name="case_type" required defaultValue="opd" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="opd">OPD</option>
                <option value="ipd">IPD</option>
                <option value="panchakarma">Panchakarma</option>
                <option value="surgery">Surgery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
            <select name="department" required defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Department...</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis / Chief Complaint <span className="text-red-500">*</span></label>
            <input type="text" name="diagnosis" required placeholder="e.g. Jwara, Amavata, Grahani..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Procedures / Treatment Given</label>
            <textarea name="procedures" rows={2} placeholder="e.g. Vamana, Virechana, Nasya, Basti..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
              <input type="text" name="patient_age" placeholder="e.g. 45M, 32F" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified By (Professor)</label>
              <select name="verified_by" defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select...</option>
                {allProfessors.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea name="remarks" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium">Save Entry</button>
            <a href="/clinical-logbook" className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium text-center">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}