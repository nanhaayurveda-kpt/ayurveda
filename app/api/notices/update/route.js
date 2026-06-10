// app/api/notices/update/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { setFlash } from "@/lib/flash";

export async function POST(request) {
  // ─── Auth ──────────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }
  const session = await getSession(token);
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const userResult = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, session.email));
  const user = userResult[0];
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  // ─── Parse form ────────────────────────────────────────────────────────
  const formData = await request.formData();
  const id = parseInt(formData.get("id"), 10);
  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category") || "general";
  const priority = formData.get("priority") || "normal";

  if (isNaN(id)) {
    await setFlash("error", "Invalid notice");
    return NextResponse.redirect(new URL("/notices", request.url), { status: 303 });
  }

  if (!title || !content) {
    await setFlash("error", "Title and content are required");
    return NextResponse.redirect(new URL(`/notices/${id}/edit`, request.url), { status: 303 });
  }

  // ─── Update ────────────────────────────────────────────────────────────
  await db
    .update(schema.notices)
    .set({
      title,
      content,
      category,
      priority,
    })
    .where(
      and(eq(schema.notices.id, id), eq(schema.notices.user_id, 1)),
    );

  await setFlash("success", "Notice updated successfully!");
  return NextResponse.redirect(new URL("/notices", request.url), { status: 303 });
}