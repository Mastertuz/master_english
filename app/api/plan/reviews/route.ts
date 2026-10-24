import { NextResponse } from "next/server";
import { listSubmissions } from "@/lib/study/inbox";
import { canUseSelfStudy } from "@/lib/self-study-access";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !canUseSelfStudy(user)) return NextResponse.json({ items: [] }, { status: 403 });

  const taskId = new URL(request.url).searchParams.get("taskId") ?? undefined;
  return NextResponse.json({ items: await listSubmissions(taskId) });
}
