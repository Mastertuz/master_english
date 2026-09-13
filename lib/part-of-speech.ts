/**
 * Части речи в словаре хранятся так, как их отдаёт Cambridge («noun», «verb»…).
 * Для тренировок и карточек показываем их по-русски.
 */
const RU: Record<string, string> = {
  noun: "существительное",
  "plural noun": "существительное (мн. ч.)",
  "uncountable noun": "неисчисляемое существительное",
  "countable noun": "исчисляемое существительное",
  verb: "глагол",
  "modal verb": "модальный глагол",
  "auxiliary verb": "вспомогательный глагол",
  "phrasal verb": "фразовый глагол",
  adjective: "прилагательное",
  adverb: "наречие",
  pronoun: "местоимение",
  preposition: "предлог",
  conjunction: "союз",
  determiner: "определитель",
  article: "артикль",
  exclamation: "восклицание",
  interjection: "междометие",
  number: "числительное",
  numeral: "числительное",
  prefix: "приставка",
  suffix: "суффикс",
  idiom: "идиома",
  phrase: "фраза",
  "verb phrase": "глагольная фраза",
  "noun phrase": "именная фраза",
  collocation: "устойчивое сочетание",
  abbreviation: "сокращение",
};

/**
 * Русское название части речи; неизвестное значение возвращаем как есть.
 * Слово с несколькими значениями хранит список: «noun, verb» →
 * «существительное, глагол».
 */
export function partOfSpeechRu(value: string): string {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) return parts.map(single).join(", ");
  return single(value);
}

function single(value: string): string {
  const key = value.trim().toLowerCase();
  if (!key) return "";

  // «noun [C]», «verb (T)» — отбрасываем пометки в скобках
  const base = key.replace(/[[(].*$/, "").trim();

  return RU[key] ?? RU[base] ?? value.trim();
}
