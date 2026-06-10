export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notices, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import EditNoticeForm from "./EditNoticeForm";

export default async function EditNoticePage({ params }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) redirect("/login");
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, session.email));
  const user = userResult[0];
  if (!user) redirect("/login");

  const { id } = await params;
  const noticeId = parseInt(id, 10);
  if (isNaN(noticeId)) notFound();

  const rows = await db
    .select()
    .from(notices)
    .where(and(eq(notices.id, noticeId), eq(notices.user_id, 1)));
  if (rows.length === 0) notFound();
  const notice = rows[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Notice</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update notice details and save
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <EditNoticeForm notice={notice} />
      </div>
    </div>
  );
}