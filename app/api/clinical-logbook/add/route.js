import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { setFlash } from "@/lib/flash";
import { MASTER_USER_ID } from "@/lib/config";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  const session = await getSession(token);
  if (!session) return NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  const formData = await request.formData();
  const student_id = parseInt(formData.get("student_id"), 10);
  const date = formData.get("date");
  const department = formData.get("department");
  const case_type = formData.get("case_type") || "opd";
  const diagnosis = formData.get("diagnosis");
  const procedures = formData.get("procedures") || null;
  const patient_age = formData.get("patient_age") || null;
  const remarks = formData.get("remarks") || null;
  const verified_by_raw = formData.get("verified_by");
  const verified_by = verified_by_raw ? parseInt(verified_by_raw, 10) : null;

  if (!student_id || !date || !department || !diagnosis) {
    await setFlash("error", "Student, date, department and diagnosis are required");
    return NextResponse.redirect(new URL("/clinical-logbook/add", request.url), { status: 303 });
  }

  const studentCheck = await db.select().from(schema.students)
    .where(and(eq(schema.students.id, student_id), eq(schema.students.user_id, MASTER_USER_ID)));
  if (!studentCheck.length) {
    await setFlash("error", "Student not found");
    return NextResponse.redirect(new URL("/clinical-logbook/add", request.url), { status: 303 });
  }

  await db.insert(schema.clinical_logs).values({
    student_id,
    user_id: MASTER_USER_ID,
    date,
    department,
    case_type,
    diagnosis,
    procedures,
    patient_age,
    remarks,
    verified_by: verified_by || null,
    status: verified_by ? "verified" : "pending",
  });

  await setFlash("success", "Clinical log entry saved!");
  return NextResponse.redirect(new URL("/clinical-logbook", request.url), { status: 303 });
}