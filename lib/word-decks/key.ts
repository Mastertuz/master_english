/** Как слово хранится в словаре: так же, как при ручном добавлении (строчными) */
export function deckWordKey(english: string): string {
  return english.trim().toLowerCase().replace(/\s+/g, " ");
}

/** «1 слово», «3 слова», «81 слово», «100 слов» */
export function wordsLabel(count: number): string {
  const forms: Record<string, string> = { one: "слово", few: "слова" };
  return `${count} ${forms[new Intl.PluralRules("ru").select(count)] ?? "слов"}`;
}
