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

// Оканчиваются на -s, но это единственное число
const SINGULAR_S = new Set([
  "news", "series", "species", "means", "gas", "bus", "lens", "bias", "atlas",
  "canvas", "chaos", "iris", "cactus", "virus", "bonus", "status", "campus",
  "boss", "glass", "dress", "class", "address", "business", "success",
  "physics", "mathematics", "economics", "politics", "athletics", "gymnastics",
]);
// Множественное число без -s
const PLURAL_IRREGULAR = new Set([
  "people", "children", "men", "women", "teeth", "feet", "mice", "geese",
  "police", "cattle", "data",
]);

/**
 * Число существительного для подсказки в тренировке: «crutch» и «customs»
 * пишутся по-разному, и без подсказки по картинке не угадать форму.
 * Для других частей речи — пустая строка.
 */
export function nounNumber(english: string, partOfSpeech: string): "singular" | "plural" | "" {
  const pos = partOfSpeech.toLowerCase();
  if (!/\bnoun\b/.test(pos) || /\bphrase\b/.test(pos)) return "";
  if (/\bplural\b/.test(pos)) return "plural";

  const last = english.trim().toLowerCase().split(/\s+/).pop() ?? "";
  if (!last || last.endsWith("'s")) return "singular";
  if (PLURAL_IRREGULAR.has(last)) return "plural";
  if (SINGULAR_S.has(last)) return "singular";
  if (/(ss|us|is|ous|ness|ics)$/.test(last)) return "singular";
  return /s$/.test(last) ? "plural" : "singular";
}

function single(value: string): string {
  const key = value.trim().toLowerCase();
  if (!key) return "";

  // «noun [C]», «verb (T)» — отбрасываем пометки в скобках
  const base = key.replace(/[[(].*$/, "").trim();

  return RU[key] ?? RU[base] ?? value.trim();
}
