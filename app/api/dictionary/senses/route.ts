import { NextResponse } from "next/server";
import { lookupSenses } from "@/lib/dictionary";
import { getCurrentUser } from "@/lib/session";

/**
 * Все значения слова из Cambridge Dictionary — для выбора при добавлении.
 * Прежний /api/dictionary/lookup с одним значением остаётся как был: его
 * читают другие места приложения.
 */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const word = new URL(request.url).searchParams.get("word") ?? "";
  if (!word.trim()) {
    return NextResponse.json({ error: "Не указано слово" }, { status: 400 });
  }

  const result = await lookupSenses(word);
  if (!result) {
    return NextResponse.json(
      { error: "Слово не найдено ни в Cambridge, ни в резервных словарях" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
