import { NextResponse } from "next/server";
import { bestSenseIndex } from "@/lib/context-sense";
import { lookupSenses, normalizeWord, translateToRussian } from "@/lib/dictionary";
import { getCurrentUser } from "@/lib/session";

/**
 * Машинные переводы слов, которых нет в англо-русском Cambridge. Переводчик
 * отвечает секунды, а одно и то же слово выделяют снова и снова — держим
 * последние ответы в памяти процесса.
 */
const machineCache = new Map<string, string>();
const MACHINE_CACHE_SIZE = 500;

async function machineTranslate(query: string): Promise<string> {
  const cached = machineCache.get(query);
  if (cached !== undefined) return cached;

  const russian = await translateToRussian(query);
  if (russian) {
    if (machineCache.size >= MACHINE_CACHE_SIZE) {
      machineCache.delete(machineCache.keys().next().value as string);
    }
    machineCache.set(query, russian);
  }
  return russian;
}

/**
 * Перевод выделенного на странице текста с учётом предложения.
 * mode = "sentence" переводит само предложение — по отдельной кнопке,
 * чтобы не тратить лимит переводчика на каждое выделение.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    text?: unknown;
    sentence?: unknown;
    mode?: unknown;
  };
  const text = String(body.text ?? "").trim().slice(0, 80);
  const sentence = String(body.sentence ?? "").replace(/\s+/g, " ").trim().slice(0, 400);

  if (body.mode === "sentence") {
    if (!sentence) {
      return NextResponse.json({ error: "Нет предложения" }, { status: 400 });
    }
    const sentenceRu = await translateToRussian(sentence);
    return sentenceRu
      ? NextResponse.json({ sentenceRu })
      : NextResponse.json({ error: "Переводчик не ответил" }, { status: 502 });
  }

  const phrase = normalizeWord(text);
  if (!phrase || !/[a-z]/i.test(phrase)) {
    return NextResponse.json({ error: "Выделите английское слово" }, { status: 400 });
  }

  const found = await lookupSenses(phrase);
  if (found?.senses.length) {
    const best = bestSenseIndex(found.senses, sentence, phrase);

    // В англо-русском словаре Cambridge слова нет («hiker») — значения
    // приходят только с английскими определениями. Тогда подставляем
    // машинный перевод словарной формы, чтобы слово можно было сохранить
    const headword = found.senses[best]?.word || found.word;
    // Без подсказки переводчик путает часть речи: «hiker» → «Пешеходный
    // туризм», а «a hiker» → «турист». Для глаголов «to» не годится —
    // «to hike» он переводит как «в поход», поэтому артикль только у имён
    const pos = found.senses[best]?.partOfSpeech ?? "";
    const query = pos.includes("noun") ? `a ${headword}` : headword;
    const machineRussian = found.senses.some((sense) => sense.russian)
      ? ""
      : await machineTranslate(query);

    return NextResponse.json({
      word: found.word,
      source: found.source,
      senses: found.senses,
      best,
      machineRussian:
        machineRussian.trim().toLowerCase() === headword.toLowerCase() ? "" : machineRussian,
    });
  }

  // Словари молчат (редкая фраза, опечатка) — хотя бы машинный перевод
  const russian = await translateToRussian(phrase);
  if (!russian || russian.trim().toLowerCase() === phrase) {
    return NextResponse.json({ error: "Перевод не найден" }, { status: 404 });
  }

  return NextResponse.json({
    word: phrase,
    source: "fallback",
    senses: [
      {
        word: phrase,
        partOfSpeech: "",
        guideword: "",
        level: "",
        russian,
        definition: "",
        example: "",
        transcription: "",
        audioUrl: "",
      },
    ],
    best: 0,
  });
}
