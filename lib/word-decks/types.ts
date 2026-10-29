/**
 * Готовые наборы слов и фраз для словаря — как общие колоды в Anki: самые частотные слова,
 * частые фразы и слова по темам. Лежат в коде и доступны всем пользователям; в личный словарь
 * слова попадают по кнопке «Добавить» (app/actions/decks.ts).
 *
 * Исходный формат строки набора: «слово | перевод | часть речи | пример».
 * Части речи: n v adj adv prep conj pron det modal aux num excl phr pv idiom col.
 */
export type DeckGroup = "frequency" | "phrases" | "topic";

export type DeckItem = {
  english: string;
  russian: string;
  partOfSpeech: string;
  example: string;
};

export type Deck = {
  id: string;
  title: string;
  group: DeckGroup;
  /** Уровень по шкале CEFR, на который рассчитан набор */
  level: string;
  icon: string;
  description: string;
  items: DeckItem[];
};

export type DeckSource = Omit<Deck, "items"> & { lines: string };
