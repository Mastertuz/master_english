/**
 * Подтягивает определения Cambridge для слов и фраз плана «Мой английский»
 * (кэшируются в базе, потом тренировка открывается без ожидания):
 *
 *   npx tsx --env-file=.env scripts/prefill-plan-definitions.ts
 *
 * Показывает, сколько слов получили определение, а какие найти не удалось.
 */
import { enrichFromCambridge, lookupTerm } from "../lib/study/definitions";
import { unitPool } from "../lib/study/deck";
import { UNITS } from "../lib/study/units";
import { WEEK_ONE_WORDS } from "../lib/study/vocab-defs";

async function main() {
  const cards = [
    ...WEEK_ONE_WORDS.map((item) => ({ id: item.en, en: item.en, ru: item.ru, example: item.example, definition: item.def, unit: 0 })),
    ...UNITS.flatMap(unitPool),
  ].filter((card) => !card.definition);

  let found = 0;
  const missing: string[] = [];
  const queue = [...cards];
  async function worker() {
    for (let card = queue.shift(); card; card = queue.shift()) {
      const term = lookupTerm(card.en);
      const result = term ? await enrichFromCambridge(card) : null;
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (result) found += 1;
      else missing.push(`${card.en}${term ? "" : " (длинный оборот)"}`);
    }
  }
  await Promise.all([worker(), worker()]);
  console.log(`Без своего определения: ${cards.length}, нашли в Cambridge: ${found}`);
  console.log("Не нашли:\n" + missing.join("\n"));
  process.exit(0);
}

main();
