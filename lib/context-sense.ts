import type { DictionarySense } from "@/lib/dictionary";

/**
 * Выбор значения слова по предложению, в котором его выделили.
 *
 * Словарь даёт все значения («book» — книга и бронировать, «light» — свет,
 * лёгкий, зажигать), а ученику нужно одно — то, что в тексте. Решаем без
 * внешних сервисов: часть речи угадываем по соседнему слову, смысл — по
 * общим словам предложения с определением и примером значения.
 */

const STOP = new Set(
  "the a an and or but of to in on at by for with from into over under about as is are was were be been being am do does did have has had it its this that these those there their they them he she his her we our you your i my me not no so too very can could will would should may might must just than then when while who which what where why how all any some".split(
    " ",
  ),
);

/** После этих слов обычно стоит существительное (или прилагательное перед ним) */
const BEFORE_NOUN = new Set(
  "a an the this that these those my your his her its our their some any no every each much many few several another other one two three four five six seven eight nine ten twelve twenty hundred thousand".split(" "),
);

/** Подлежащие, после которых слово на -s — глагол: «she books», «it locks» */
const SINGULAR_SUBJECT = new Set("he she it who which that".split(" "));

/** После этих слов — глагол */
const BEFORE_VERB = new Set(
  "to can could will would shall should may might must i you we they he she don't doesn't didn't won't can't never always often usually sometimes".split(" "),
);

/** После этих слов — прилагательное или причастие */
const BEFORE_ADJECTIVE = new Set(
  "very so too more most less least quite rather really is are was were be been am feel feels felt look looks looked seem seems seemed become became get got".split(" "),
);

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

/** Грубая основа слова: «designed», «designs», «designing» → «design» */
function stem(word: string): string {
  return word.replace(/(ing|ed|es|s)$/, "");
}

function contentStems(text: string): string[] {
  return words(text)
    .filter((word) => word.length > 2 && !STOP.has(word))
    .map(stem);
}

/** Части речи в порядке вероятности по окружению выделенного слова */
export function guessPartsOfSpeech(sentence: string, phrase: string): string[] {
  const target = words(phrase);
  if (target.length !== 1) return [];

  const list = words(sentence);
  const index = list.indexOf(target[0]);
  const before = index > 0 ? list[index - 1] : "";
  const self = target[0];
  const hints: string[] = [];

  if (self.endsWith("ly")) hints.push("adverb");
  // Множественное число: «there were boxes», «forty-five river locks».
  // Глагол на -s бывает только после he/she/it или модального «to/can»
  if (
    /[^s]s$/.test(self) &&
    self.length > 3 &&
    !SINGULAR_SUBJECT.has(before) &&
    !BEFORE_VERB.has(before)
  ) {
    hints.push("noun");
  }
  if (BEFORE_VERB.has(before)) hints.push("verb");
  if (BEFORE_NOUN.has(before)) hints.push("noun", "adjective");
  if (BEFORE_ADJECTIVE.has(before)) {
    // «was designed» — страдательный залог, «is famous» — прилагательное
    hints.push(/(ed|en)$/.test(self) ? "verb" : "adjective", "verb");
  }
  if (!hints.length && /(ed|ing)$/.test(self)) hints.push("verb", "adjective");

  return [...new Set(hints)];
}

/** Индекс значения, которое лучше всего подходит к предложению */
export function bestSenseIndex(
  senses: DictionarySense[],
  sentence: string,
  phrase: string,
): number {
  if (senses.length <= 1) return 0;

  const hints = guessPartsOfSpeech(sentence, phrase);
  const own = new Set(contentStems(phrase));
  const context = new Set(contentStems(sentence).filter((word) => !own.has(word)));

  let best = 0;
  let bestScore = Number.NEGATIVE_INFINITY;

  senses.forEach((sense, index) => {
    // Словарь ставит частые значения первыми
    let score = -index * 0.35;

    const pos = sense.partOfSpeech.toLowerCase();
    const hint = hints.findIndex((part) => pos.includes(part));
    if (hint >= 0) score += 3 - hint;
    else if (hints.length) score -= 1.5;

    const overlap = contentStems(
      `${sense.definition} ${sense.example} ${sense.guideword}`,
    ).filter((word) => context.has(word)).length;
    score += overlap * 1.5;

    if (!sense.russian) score -= 2;
    if (["A1", "A2", "B1"].includes(sense.level)) score += 0.3;

    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });

  return best;
}
