import { db } from "@/lib/db";
import { notices } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function GET(request, { params }) {
  const { id } = await params;
  const noticeId = parseInt(id, 10);
  if (!isNaN(noticeId)) {
    await db
      .delete(notices)
      .where(and(eq(notices.id, noticeId), eq(notices.user_id, 1)));
  }

  redirect("/notices");
}