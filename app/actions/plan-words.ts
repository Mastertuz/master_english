"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canUseSelfStudy } from "@/lib/self-study-access";
import { getCurrentUser } from "@/lib/session";
import { dayWords } from "@/lib/study/deck";
import { UNITS } from "@/lib/study/units";
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
  for (const card of cards) {
    const data = {
      russian: acceptVariants(card.ru),
      example: card.example,
      definition: card.definition,
      definitionRu: card.definition ? card.ru : "",
      source: "plan",
    };
    await prisma.word.upsert({
      where: { userId_english: { userId: user.id, english: card.en } },
      create: { userId: user.id, english: card.en, assigned: true, ...data },
      // Слово уже есть в словаре: свой перевод и статистику не трогаем
      update: { assigned: true },
    });
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
