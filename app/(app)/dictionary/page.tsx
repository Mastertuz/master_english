import Link from "next/link";
import { AddWordForm } from "@/components/dictionary/AddWordForm";
import { WordLookup } from "@/components/dictionary/WordLookup";
import { WordsTable, type WordRow } from "@/components/dictionary/WordsTable";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function DictionaryPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const [words, students] = await Promise.all([
    prisma.word.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      // Тема урока, из которого пришло слово — по ней работает фильтр
      include: {
        lessonWord: {
          select: { lesson: { select: { number: true, topic: true } } },
        },
      },
    }),
    isAdmin
      ? prisma.user.findMany({
          where: { role: "STUDENT" },
          orderBy: { lastName: "asc" },
          select: { id: true, firstName: true, lastName: true },
        })
      : Promise.resolve([]),
  ]);

  const rows: WordRow[] = words.map((word) => ({
    id: word.id,
    english: word.english,
    russian: word.russian,
    example: word.example,
    definition: word.definition,
    definitionRu: word.definitionRu,
    transcription: word.transcription,
    partOfSpeech: word.partOfSpeech,
    imageUrl: word.imageUrl,
    audioUrl: word.audioUrl,
    correctCount: word.correctCount,
    wrongCount: word.wrongCount,
    lesson: word.lessonWord
      ? {
          number: word.lessonWord.lesson.number,
          topic: word.lessonWord.lesson.topic,
        }
      : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Словарь</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            Перевод, пример употребления и определение — из Cambridge Dictionary
          </p>
        </div>
        <Link href="/training" prefetch className="btn-ghost">
          🎯 Тренировать слова
        </Link>
      </div>

      {isAdmin ? (
        <AddWordForm
          owners={students.map((student) => ({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
          }))}
        />
      ) : (
        <WordLookup />
      )}

      <WordsTable words={rows} canEdit={isAdmin} />
    </div>
  );
}
