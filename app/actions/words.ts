"use server";

import { revalidatePath } from "next/cache";
import { lookupWord, normalizeWord } from "@/lib/dictionary";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUser } from "@/lib/session";
import { collect, type FieldErrors } from "@/lib/validation";

export type WordState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
} | null;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Слова в словарь добавляет администратор — своему аккаунту или ученику */
export async function addWordAction(
  _prev: WordState,
  formData: FormData,
): Promise<WordState> {
  const me = await requireUser();
  if (me.role !== "ADMIN") {
    return { ok: false, message: "Слова добавляет администратор" };
  }

  const ownerId = str(formData, "userId") || me.id;
  const english = normalizeWord(str(formData, "english"));
  const russian = str(formData, "russian");

  const errors = collect({
    english: english ? null : "Укажите слово на английском",
    russian: russian ? null : "Укажите перевод",
  });
  if (errors) return { ok: false, message: "Заполните поля", errors };

  const exists = await prisma.word.findUnique({
    where: { userId_english: { userId: ownerId, english } },
    select: { id: true },
  });
  if (exists) {
    return {
      ok: false,
      message: "Такое слово уже есть в словаре",
      errors: { english: "Слово уже добавлено" },
    };
  }

  await prisma.word.create({
    data: {
      userId: ownerId,
      english,
      russian,
      example: str(formData, "example"),
      definition: str(formData, "definition"),
      definitionRu: str(formData, "definitionRu"),
      transcription: str(formData, "transcription"),
      partOfSpeech: str(formData, "partOfSpeech"),
      audioUrl: str(formData, "audioUrl"),
      imageUrl: str(formData, "imageUrl"),
      source: str(formData, "source") || "manual",
    },
  });

  revalidatePath("/dictionary");
  revalidatePath("/training");
  revalidatePath(`/students/${ownerId}`);
  return { ok: true, message: `Слово «${english}» добавлено` };
}

/**
 * Слово из выделенного на странице текста — в собственный словарь.
 * Доступно всем: ученик пополняет словарь сам, прямо во время чтения.
 */
export async function addWordFromTextAction(input: {
  english: string;
  russian: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  transcription: string;
  audioUrl: string;
  source: string;
}): Promise<{ ok: boolean; exists?: boolean; message: string }> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, message: "Нужно войти в аккаунт" };

  const english = normalizeWord(String(input.english ?? "")).slice(0, 60);
  const russian = String(input.russian ?? "").trim().slice(0, 200);
  if (!english || !russian) {
    return { ok: false, message: "Нет перевода — добавьте слово вручную в словаре" };
  }

  const exists = await prisma.word.findUnique({
    where: { userId_english: { userId: me.id, english } },
    select: { id: true },
  });
  if (exists) {
    return { ok: false, exists: true, message: `«${english}» уже есть в вашем словаре` };
  }

  const text = (value: unknown, limit: number) => String(value ?? "").trim().slice(0, limit);
  const audioUrl = text(input.audioUrl, 500);

  await prisma.word.create({
    data: {
      userId: me.id,
      english,
      russian,
      partOfSpeech: text(input.partOfSpeech, 60),
      definition: text(input.definition, 500),
      example: text(input.example, 400),
      transcription: text(input.transcription, 120),
      audioUrl: audioUrl.startsWith("https://") ? audioUrl : "",
      source: input.source === "cambridge" ? "cambridge" : "fallback",
    },
  });

  revalidatePath("/dictionary");
  revalidatePath("/training");
  revalidatePath(`/students/${me.id}`);
  return { ok: true, message: `«${english}» добавлено в словарь` };
}

export async function updateWordAction(
  _prev: WordState,
  formData: FormData,
): Promise<WordState> {
  const me = await requireUser();
  const id = str(formData, "id");

  const word = await prisma.word.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!word) return { ok: false, message: "Слово не найдено" };

  const isAdmin = me.role === "ADMIN";
  if (word.userId !== me.id && !isAdmin) {
    return { ok: false, message: "Нет доступа к этому слову" };
  }

  const english = normalizeWord(str(formData, "english"));
  const russian = str(formData, "russian");

  const errors = collect({
    english: english ? null : "Укажите слово на английском",
    russian: russian ? null : "Укажите перевод",
  });
  if (errors) return { ok: false, message: "Заполните поля", errors };

  await prisma.word.update({
    where: { id },
    data: {
      english,
      russian,
      example: str(formData, "example"),
      definition: str(formData, "definition"),
      definitionRu: str(formData, "definitionRu"),
      transcription: str(formData, "transcription"),
      partOfSpeech: str(formData, "partOfSpeech"),
      // картинку для тренировки меняет только администратор
      ...(isAdmin ? { imageUrl: str(formData, "imageUrl") } : {}),
    },
  });

  revalidatePath("/dictionary");
  revalidatePath("/training");
  revalidatePath(`/students/${word.userId}`);
  return { ok: true, message: "Изменения сохранены" };
}

export async function deleteWordAction(formData: FormData): Promise<void> {
  const me = await requireUser();
  if (me.role !== "ADMIN") return;

  const id = String(formData.get("id") ?? "");
  await prisma.word.deleteMany({ where: { id } });

  revalidatePath("/dictionary");
}

/** Поиск слова в Cambridge — доступен и ученику, и администратору */
export async function lookupAction(word: string) {
  await requireUser();
  return lookupWord(word);
}

/** Записать результат тренировки и обновить статистику слова */
export async function recordAttemptAction(input: {
  wordId: string;
  mode: "TRANSLATE" | "IMAGE" | "DEFINITION";
  direction: "EN_RU" | "RU_EN";
  isCorrect: boolean;
  answer: string;
}): Promise<void> {
  const me = await getCurrentUser();
  if (!me) return;

  const word = await prisma.word.findFirst({
    where: { id: input.wordId, userId: me.id },
    select: { id: true },
  });
  if (!word) return;

  await prisma.$transaction([
    prisma.trainingAttempt.create({
      data: {
        userId: me.id,
        wordId: input.wordId,
        mode: input.mode,
        direction: input.direction,
        isCorrect: input.isCorrect,
        answer: input.answer.slice(0, 200),
      },
    }),
    prisma.word.update({
      where: { id: input.wordId },
      data: {
        lastTrainedAt: new Date(),
        ...(input.isCorrect
          ? { correctCount: { increment: 1 } }
          : { wrongCount: { increment: 1 } }),
      },
    }),
  ]);
}
