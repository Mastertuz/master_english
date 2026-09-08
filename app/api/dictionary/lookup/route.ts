import { NextResponse } from "next/server";
import { lookupWord } from "@/lib/dictionary";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const word = new URL(request.url).searchParams.get("word") ?? "";
  if (!word.trim()) {
    return NextResponse.json({ error: "Не указано слово" }, { status: 400 });
  }

  const result = await lookupWord(word);
  if (!result) {
    return NextResponse.json(
      { error: "Слово не найдено ни в Cambridge, ни в резервных словарях" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
