"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { lookupTerm } from "@/lib/study/definitions";
import { acceptVariants } from "@/lib/study/vocab-defs";
import { deckById, deckWordKey } from "@/lib/word-decks";

export type AddDeckResult = { ok: boolean; added: number; skipped: number; message: string };

/**
 * Готовый набор слов — в личный словарь пользователя (любой роли). Уже имеющиеся слова
 * не трогаем: ни перевод, ни статистику. Определение, транскрипция и озвучка берутся из
 * кэша Cambridge, если слово там уже есть (кэш пополняется скриптом prefill-deck-definitions
 * и обычными поисками по словарю).
 */
export async function addDeckWordsAction(deckId: string, only?: string[]): Promise<AddDeckResult> {
  const me = await requireUser();
  const deck = deckById(deckId);
  if (!deck) return { ok: false, added: 0, skipped: 0, message: "Набор не найден" };

  const wanted = only ? new Set(only.map(deckWordKey)) : null;
  const items = deck.items.filter((item) => !wanted || wanted.has(deckWordKey(item.english)));
  if (items.length === 0) return { ok: true, added: 0, skipped: 0, message: "Нечего добавлять" };

  const keys = items.map((item) => deckWordKey(item.english));
  const existing = await prisma.word.findMany({
    where: { userId: me.id, english: { in: keys } },
    select: { english: true },
  });
  const have = new Set(existing.map((word) => word.english));
  const fresh = items.filter((item) => !have.has(deckWordKey(item.english)));

  const terms = fresh.map((item) => lookupTerm(item.english)).filter((term): term is string => Boolean(term));
  const cached = terms.length
    ? await prisma.dictionaryCache.findMany({
        where: { word: { in: terms }, source: "cambridge", NOT: { definition: "" } },
      })
    : [];
  const byWord = new Map(cached.map((entry) => [entry.word, entry]));

  const result = await prisma.word.createMany({
    data: fresh.map((item) => {
      const term = lookupTerm(item.english);
      const entry = term ? byWord.get(term) : undefined;
      const definition = entry?.definition ?? "";
      return {
        userId: me.id,
        english: deckWordKey(item.english),
        russian: acceptVariants(item.russian),
        example: item.example || entry?.example || "",
        definition,
        definitionRu: definition ? item.russian : "",
        transcription: entry?.transcription ?? "",
        partOfSpeech: item.partOfSpeech || entry?.partOfSpeech || "",
        audioUrl: entry?.audioUrl ?? "",
        source: `deck:${deck.id}`,
      };
    }),
    skipDuplicates: true,
  });

  revalidatePath("/dictionary");
  revalidatePath("/dictionary/decks");
  revalidatePath(`/dictionary/decks/${deck.id}`);
  revalidatePath("/training");

  const skipped = items.length - result.count;
  return {
    ok: true,
    added: result.count,
    skipped,
    message:
      result.count > 0
        ? `Добавлено слов: ${result.count}${skipped > 0 ? `, уже были в словаре: ${skipped}` : ""}`
        : "Все эти слова уже есть в вашем словаре",
  };
}
