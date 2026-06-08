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
  const department = formData.get("department");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const supervisor_raw = formData.get("supervisor_id");
  const supervisor_id = supervisor_raw ? parseInt(supervisor_raw, 10) : null;

  if (!student_id || !department || !start_date || !end_date) {
    await setFlash("error", "Student, department and dates are required");
    return NextResponse.redirect(new URL("/internship/add", request.url), { status: 303 });
  }

  const studentCheck = await db.select().from(schema.students)
    .where(and(eq(schema.students.id, student_id), eq(schema.students.user_id, MASTER_USER_ID)));
  if (!studentCheck.length) {
    await setFlash("error", "Student not found");
    return NextResponse.redirect(new URL("/internship/add", request.url), { status: 303 });
  }

  await db.insert(schema.internship_postings).values({
    student_id,
    user_id: MASTER_USER_ID,
    department,
    start_date,
    end_date,
    supervisor_id: supervisor_id || null,
    status: "ongoing",
  });

  await setFlash("success", "Internship posting added!");
  return NextResponse.redirect(new URL("/internship", request.url), { status: 303 });
}