import type { ListeningQuestion, ListeningTrack, Pair, UnitLesson } from "./types";

/** Вопрос: текст, варианты, номер верного (с нуля), объяснение */
export type Q = [question: string, options: string[], answer: number, why: string];

export function question([q, options, answer, why]: Q): ListeningQuestion {
  return { q, options, answer, why };
}

export function listening(
  unit: number,
  track: string,
  title: string,
  where: string,
  focus: string,
  questions: Q[],
  phrases: Pair[],
): ListeningTrack {
  return {
    track,
    title,
    where,
    audio: `/audio/empower-c1/unit${unit}/${track}.m4a`,
    focus,
    questions: questions.map(question),
    phrases,
  };
}

/**
 * Уроки юнита: страницы считаются от первой страницы юнита o (Getting started):
 * A — три страницы, B — три, C — две, D — две, затем Review and extension.
 */
export function unitLessons(
  o: number,
  items: { id: string; title: string; goal: string; grammar?: string; vocabulary?: string }[],
): UnitLesson[] {
  const spans: [number, number][] = [
    [o + 1, o + 3],
    [o + 4, o + 6],
    [o + 7, o + 8],
    [o + 9, o + 10],
  ];
  const lessons = items.map((item, index) => ({
    ...item,
    pages: `стр. ${spans[index][0]}–${spans[index][1]}`,
  }));
  lessons.push({
    id: "R",
    title: "Review and extension",
    goal: "Повторить грамматику и лексику юнита, выучить идиомы Wordpower",
    pages: `стр. ${o + 11}`,
    grammar: undefined,
    vocabulary: undefined,
  });
  return lessons;
}
