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
  if (!id) return NextResponse.redirect(new URL("/internship", request.url), { status: 303 });

  await db.update(schema.internship_postings).set({ status: "completed" }).where(eq(schema.internship_postings.id, id));

  await setFlash("success", "Posting marked as completed!");
  return NextResponse.redirect(new URL("/internship", request.url), { status: 303 });
}