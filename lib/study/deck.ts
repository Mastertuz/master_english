import { UNITS } from "./units";

export type DeckCard = {
  id: string;
  unit: number;
  en: string;
  ru: string;
  example?: string;
  /** Откуда карточка: слова юнита или фразы из записи */
  source: "vocab" | "audio";
};

/** Колода для повторения: слова юнитов и фразы из записей, по порядку юнитов */
export function buildDeck(): DeckCard[] {
  const cards: DeckCard[] = [];
  for (const unit of UNITS) {
    for (const item of unit.vocab) {
      cards.push({
        id: `u${unit.n}:${item.en}`,
        unit: unit.n,
        en: item.en,
        ru: item.ru,
        example: item.example,
        source: "vocab",
      });
    }
    for (const track of unit.tracks) {
      for (const [en, ru] of track.phrases) {
        cards.push({ id: `u${unit.n}:${en}`, unit: unit.n, en, ru, source: "audio" });
      }
    }
  }
  return cards;
}

import { PHRASE_DEFINITIONS } from "./phrase-defs";
import { DEFINITIONS, WEEK_ONE_WORDS, cleanEnglish, type WordCard } from "./vocab-defs";
import type { EmpowerUnit } from "./types";

/** Слова и фразы юнита вперемешку: слово, фраза из записи, слово… — чтобы в каждый день попадало и то и другое */
export function unitPool(unit: EmpowerUnit): WordCard[] {
  const words: WordCard[] = unit.vocab.map((item) => ({
    id: `u${unit.n}:${item.en}`,
    en: cleanEnglish(item.en),
    ru: item.ru,
    example: item.example,
    definition: DEFINITIONS[item.en] ?? "",
    unit: unit.n,
  }));
  const phrases: WordCard[] = unit.tracks.flatMap((track) =>
    track.phrases.map(([en, ru]) => ({
      id: `u${unit.n}:${en}`,
      en: cleanEnglish(en),
      ru,
      example: "",
      // Определения «из сборника» только у того, чего нет в Cambridge; остальное подтягивается оттуда при тренировке
      definition: PHRASE_DEFINITIONS[cleanEnglish(en)] ?? "",
      unit: unit.n,
    })),
  );
  const mixed: WordCard[] = [];
  for (let i = 0; i < Math.max(words.length, phrases.length); i += 1) {
    if (words[i]) mixed.push(words[i]);
    if (phrases[i]) mixed.push(phrases[i]);
  }
  return mixed;
}

const WEEK_ONE: WordCard[] = WEEK_ONE_WORDS.map((item) => ({
  id: `w1:${item.en}`,
  en: item.en,
  ru: item.ru,
  example: item.example,
  definition: item.def,
  unit: 0,
}));

/** Слова недели: недели 2–21 берут половину пула своего юнита, неделя 1 и экзаменные недели — свои наборы */
export function weekWords(week: number, units: EmpowerUnit[]): WordCard[] {
  if (week === 1) return WEEK_ONE;
  if (week >= 2 && week <= 21) {
    const unit = units[Math.floor((week - 2) / 2)];
    const pool = unitPool(unit);
    const half = Math.ceil(pool.length / 2);
    return (week - 2) % 2 === 0 ? pool.slice(0, half) : pool.slice(half);
  }
  // Экзаменные недели: повторение каждого второго слова пройденных юнитов
  const range = week === 22 ? [1, 3] : week === 23 ? [4, 7] : [8, 10];
  const pool = units.filter((unit) => unit.n >= range[0] && unit.n <= range[1]).flatMap(unitPool);
  return pool.filter((_, index) => index % 2 === 0).slice(0, 18);
}

/**
 * Слова дня: в дни 1–6 недели новые слова поровну (по 2–3), а в день 7 повторение всех слов недели.
 */
export function dayWords(week: number, dayIndex: number, units: EmpowerUnit[]): WordCard[] {
  const all = weekWords(week, units);
  if (dayIndex >= 6) return all;
  const base = Math.floor(all.length / 6);
  const extra = all.length % 6;
  const start = dayIndex * base + Math.min(dayIndex, extra);
  const size = base + (dayIndex < extra ? 1 : 0);
  return all.slice(start, start + size);
}
