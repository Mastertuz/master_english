"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canUseSelfStudy } from "@/lib/self-study-access";
import { getCurrentUser } from "@/lib/session";
import { dayWords } from "@/lib/study/deck";
import { UNITS } from "@/lib/study/units";
import { enrichFromCambridge } from "@/lib/study/definitions";
import { acceptVariants } from "@/lib/study/vocab-defs";

/**
 * Слова плана попадают в ваш личный словарь (источник «plan») и в тренажёр основного
 * сайта: перевод, определение, статистика ответов. Слова нужных дней помечаются
 * «к следующему уроку», поэтому тренажёр открывается сразу с ними.
 */
export async function startPlanTrainingAction(
  week: number,
  fromDay: number,
  toDay: number,
  mode: "translate" | "definition",
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !canUseSelfStudy(user)) redirect("/dashboard");

  // Слова считаем на сервере по расписанию: из браузера приходят только номера дня и недели
  const seen = new Set<string>();
  const cards = [];
  for (let day = fromDay; day <= toDay; day += 1) {
    for (const card of dayWords(week, day, UNITS)) {
      if (seen.has(card.id)) continue;
      seen.add(card.id);
      cards.push(card);
    }
  }

  const english = cards.map((card) => card.en);

  // Определения: свои есть у слов юнитов, для остальных ищем в Cambridge (результат кэшируется в базе)
  const extra = await Promise.all(cards.map((card) => (card.definition ? null : enrichFromCambridge(card))));

  for (const [index, card] of cards.entries()) {
    const found = extra[index];
    const definition = card.definition || found?.definition || "";
    const data = {
      russian: acceptVariants(card.ru),
      example: card.example || found?.example || "",
      definition,
      definitionRu: definition ? card.ru : "",
      transcription: found?.transcription ?? "",
      partOfSpeech: found?.partOfSpeech ?? "",
      audioUrl: found?.audioUrl ?? "",
      source: "plan",
    };
    const existing = await prisma.word.findUnique({
      where: { userId_english: { userId: user.id, english: card.en } },
      select: { id: true, definition: true },
    });
    if (!existing) {
      await prisma.word.create({ data: { userId: user.id, english: card.en, assigned: true, ...data } });
    } else {
      // Своё слово не трогаем, но недостающее определение дополняем
      await prisma.word.update({
        where: { id: existing.id },
        data: existing.definition ? { assigned: true } : { assigned: true, definition: data.definition, definitionRu: data.definitionRu },
      });
    }
  }

  // Прежний выбор снимаем: в «назначенных» остаются только слова этого занятия
  await prisma.word.updateMany({
    where: { userId: user.id, source: "plan", english: { notIn: english }, assigned: true },
    data: { assigned: false },
  });

  revalidatePath("/dictionary");
  revalidatePath("/training");
  redirect(`/training/${mode}?assigned=1`);
}
