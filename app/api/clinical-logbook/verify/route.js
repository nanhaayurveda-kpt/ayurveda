import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { setFlash } from "@/lib/flash";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  const session = await getSession(token);
  if (!session) return NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  const formData = await request.formData();
  const id = parseInt(formData.get("id"), 10);
  if (!id) return NextResponse.redirect(new URL("/clinical-logbook", request.url), { status: 303 });

  await db.update(schema.clinical_logs).set({ status: "verified" }).where(eq(schema.clinical_logs.id, id));

  await setFlash("success", "Entry verified!");
  return NextResponse.redirect(new URL("/clinical-logbook", request.url), { status: 303 });
}