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
