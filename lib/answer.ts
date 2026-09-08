/** Приводит ответ к сравнимому виду: регистр, пунктуация, артикли, «to» */
export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:"'`«»()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    // Снимаем начальные служебные слова, пока они есть: ответы «wedding»,
    // «a wedding» и «to a wedding» на вопрос Where…? одинаково верны
    .replace(/^(?:(?:to|the|a|an)\s+)+/, "")
    .trim();
}

/**
 * Правильный ответ может содержать несколько вариантов через запятую,
 * слэш или точку с запятой — засчитываем любой из них.
 */
export function isAnswerCorrect(given: string, expected: string): boolean {
  const answer = normalizeAnswer(given);
  if (!answer) return false;

  return expected
    .split(/[,;/|]/)
    .map((variant) => normalizeAnswer(variant))
    .filter(Boolean)
    .some((variant) => variant === answer);
}

/** Перемешивание массива (алгоритм Фишера — Йетса) */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
