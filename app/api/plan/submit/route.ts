import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/study/inbox";
import { canUseSelfStudy } from "@/lib/self-study-access";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !canUseSelfStudy(user)) return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    taskId?: string;
    title?: string;
    prompt?: string;
    text?: string;
    kind?: string;
  } | null;
  if (!body?.taskId || !body.text?.trim()) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  try {
    const kind = body.kind === "video" || body.kind === "speaking" ? body.kind : "writing";
    const submission = await saveSubmission({
      taskId: body.taskId,
      title: body.title ?? body.taskId,
      prompt: body.prompt ?? "",
      text: body.text,
      kind,
    });
    return NextResponse.json({ ok: true, id: submission.id });
  } catch {
    // На хостинге диск только для чтения: работа копируется в чат вручную
    return NextResponse.json({ ok: false, error: "readonly" }, { status: 503 });
  }
}
