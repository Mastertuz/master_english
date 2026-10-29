import { FREQUENCY_DECKS } from "./frequency";
import { PHRASE_DECKS } from "./phrases";
import { TOPIC_DECKS_A } from "./topics-a";
import { TOPIC_DECKS_B } from "./topics-b";
import type { Deck, DeckGroup, DeckItem, DeckSource } from "./types";

export type { Deck, DeckGroup, DeckItem } from "./types";

/** Короткие обозначения частей речи → как их хранит словарь (по Cambridge) */
const POS: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  prep: "preposition",
  conj: "conjunction",
  pron: "pronoun",
  det: "determiner",
  modal: "modal verb",
  aux: "auxiliary verb",
  num: "number",
  excl: "exclamation",
  phr: "phrase",
  pv: "phrasal verb",
  idiom: "idiom",
  col: "collocation",
};

function parse(source: DeckSource): Deck {
  const seen = new Set<string>();
  const items: DeckItem[] = [];

  for (const raw of source.lines.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const [english, russian, pos, example] = line.split(" | ").map((part) => part.trim());
    if (!english || !russian) continue;
    const key = english.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ english, russian, partOfSpeech: POS[pos] ?? "", example: example ?? "" });
  }

  const { lines: _lines, ...rest } = source;
  void _lines;
  return { ...rest, items };
}

export const DECKS: Deck[] = [
  ...FREQUENCY_DECKS,
  ...PHRASE_DECKS,
  ...TOPIC_DECKS_A,
  ...TOPIC_DECKS_B,
].map(parse);

export function deckById(id: string): Deck | undefined {
  return DECKS.find((deck) => deck.id === id);
}

export const DECK_GROUPS: { id: DeckGroup; title: string; text: string }[] = [
  {
    id: "frequency",
    title: "Самые частотные слова",
    text: "Основа словаря: слова, которые встречаются в речи и текстах чаще всего. Начинайте отсюда.",
  },
  {
    id: "phrases",
    title: "Фразы, фразовые глаголы и идиомы",
    text: "Готовые обороты для разговора и письма: то, без чего речь звучит неестественно.",
  },
  {
    id: "topic",
    title: "Слова по темам",
    text: "Лексика по жизненным ситуациям: путешествие, работа, здоровье, технологии и другое.",
  },
];

/** Как слово хранится в словаре: так же, как при ручном добавлении (строчными) */
export function deckWordKey(english: string): string {
  return english.trim().toLowerCase().replace(/\s+/g, " ");
}
