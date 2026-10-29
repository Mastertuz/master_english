/**
 * Подтягивает из Cambridge определения, транскрипцию и озвучку для слов готовых наборов
 * (кэш в базе). Набор, добавленный после этого, сразу получает определения и работает в режиме
 * «слово по определению»:
 *
 *   npx tsx --env-file=.env scripts/prefill-deck-definitions.ts
 *
 * Работает медленно (около двух запросов в секунду, чтобы Cambridge не отказывал) и умеет
 * продолжать: найденное уже лежит в кэше и повторно не запрашивается.
 */
import { enrichFromCambridge, lookupTerm } from "../lib/study/definitions";
import { DECKS } from "../lib/word-decks";

async function main() {
  const seen = new Set<string>();
  const queue = DECKS.flatMap((deck) => deck.items)
    .filter((item) => {
      const term = lookupTerm(item.english);
      if (!term || seen.has(term)) return false;
      seen.add(term);
      return true;
    })
    .map((item) => ({ id: item.english, en: item.english, ru: item.russian, example: item.example, definition: "", unit: 0 }));

  console.log(`Слов для поиска: ${queue.length}`);
  let done = 0;
  let found = 0;
  async function worker() {
    for (let card = queue.shift(); card; card = queue.shift()) {
      if (await enrichFromCambridge(card)) found += 1;
      done += 1;
      if (done % 50 === 0) console.log(`${done}: найдено ${found}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  await Promise.all([worker(), worker()]);
  console.log(`Готово: найдено в Cambridge ${found} из ${done}`);
  process.exit(0);
}

main();
