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

/**
 * Порядок вариантов ответа, одинаковый для задания при каждом показе.
 * В заданиях правильный вариант часто записан первым — показываем варианты
 * вперемешку, но стабильно: по id задания, чтобы порядок не прыгал между
 * перезагрузками и совпадал на сервере и в браузере.
 */
export function stableOrder(seed: string, length: number): number[] {
  // FNV-1a — хеш строки в число-зерно
  let state = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  // mulberry32 — простой детерминированный генератор
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
