/**
 * Дозаполняет поля слов (часть речи, транскрипция, озвучка, определение,
 * пример) — и в личных словарях (Word), и в словарях уроков (LessonWord),
 * откуда слова копируются ученикам.
 *
 * Два источника:
 *  1. Онлайн-поиск, тот же что и в словаре, — заполняет пустые поля.
 *  2. content/word-details.json — выверенные вручную значения. Применяются
 *     последними и перекрывают онлайн: Cambridge не знает фраз целиком
 *     («arrival hall»), отдаёт не то значение («gate» — часть забора,
 *     «deposit» — глагол) и помечает словосочетания как «collocation».
 *
 * Запуск:
 *   npm run words:backfill  — только заполнить пустые поля
 *   npm run words:refresh   — плюс перечитать часть речи и транскрипцию
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { lookupWord } from "../lib/dictionary";
import { closeDb, prisma } from "../lib/prisma";

/** Пауза между запросами — Cambridge не любит частых обращений */
const DELAY_MS = 400;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Row = {
  id: string;
  english: string;
  partOfSpeech: string;
  transcription: string;
  audioUrl: string;
  definition: string;
  example: string;
};

type Curated = Record<
  string,
  {
    definition?: string;
    example?: string;
    partOfSpeech?: string;
    transcription?: string;
  }
>;

/**
 * --refresh перезаписывает часть речи и транскрипцию тем, что нашлось
 * онлайн, даже если поля уже заполнены. Это факты о слове, а не редактура,
 * и их приходится обновлять после правок в разборе страницы Cambridge.
 * Определение и пример так не трогаем — их правит преподаватель.
 */
const REFRESH = process.argv.includes("--refresh");

const SELECT = {
  id: true,
  english: true,
  partOfSpeech: true,
  transcription: true,
  audioUrl: true,
  definition: true,
  example: true,
} as const;

async function loadCurated(): Promise<Curated> {
  const file = path.join(process.cwd(), "content", "word-details.json");
  const raw = JSON.parse(await readFile(file, "utf8")) as Record<
    string,
    unknown
  >;

  const curated: Curated = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("_") || typeof value !== "object" || !value) continue;
    curated[key.toLowerCase()] = value as Curated[string];
  }
  return curated;
}

/**
 * Итоговые значения для строки: сначала то, что нашлось онлайн, сверху —
 * выверенный файл. Порядок важен: раньше онлайн-данные применялись
 * последними и затирали ручные правки при --refresh.
 *
 * Онлайн-поиск заполняет только пустые поля; исключение — часть речи и
 * транскрипция при --refresh. Возвращаем лишь то, что реально меняется.
 */
function changes(
  row: Row,
  curated: Curated,
  found: Awaited<ReturnType<typeof lookupWord>>,
): Record<string, string> {
  const next: Record<string, string> = {};

  const fromOnline = (field: keyof Row, value: string, overwrite: boolean) => {
    if (value && (overwrite || !row[field])) next[field] = value;
  };

  if (found) {
    fromOnline("partOfSpeech", found.partOfSpeech, REFRESH);
    fromOnline("transcription", found.transcription, REFRESH);
    fromOnline("audioUrl", found.audioUrl, false);
    fromOnline("definition", found.definition, false);
    fromOnline("example", found.example, false);
  }

  const entry = curated[row.english.toLowerCase()];
  if (entry) {
    for (const field of [
      "definition",
      "example",
      "partOfSpeech",
      "transcription",
    ] as const) {
      if (entry[field]) next[field] = entry[field];
    }
  }

  return Object.fromEntries(
    Object.entries(next).filter(([field, value]) => value !== row[field as keyof Row]),
  );
}

/** Есть ли смысл идти в интернет: что-то пусто или запрошено обновление */
function needsLookup(row: Row, curated: Curated): boolean {
  if (REFRESH) return true;

  const entry = curated[row.english.toLowerCase()] ?? {};
  const filled = (field: keyof Row) => row[field] || entry[field as never];

  return !(
    row.partOfSpeech &&
    row.transcription &&
    row.audioUrl &&
    filled("definition") &&
    filled("example")
  );
}

async function backfill(
  label: string,
  rows: Row[],
  curated: Curated,
  update: (id: string, data: Record<string, string>) => Promise<unknown>,
) {
  console.log(`\n${label}: ${rows.length}`);

  let updated = 0;
  let missed = 0;

  for (const row of rows) {
    let found: Awaited<ReturnType<typeof lookupWord>> = null;

    if (needsLookup(row, curated)) {
      found = await lookupWord(row.english);
      await sleep(DELAY_MS);
    }

    const data = changes(row, curated, found);

    if (Object.keys(data).length === 0) {
      if (!found && needsLookup(row, curated)) {
        missed += 1;
        console.log(`  · ${row.english} — не найдено`);
      }
      continue;
    }

    await update(row.id, data);
    updated += 1;
    console.log(`  ✓ ${row.english} — ${Object.keys(data).join(", ")}`);
  }

  console.log(`  итого: обновлено ${updated}, не найдено ${missed}`);
}

/** Слова, у которых после прогона остались незаполненные поля */
async function reportGaps() {
  const gaps = await prisma.word.findMany({
    where: {
      OR: [
        { definition: "" },
        { example: "" },
        { transcription: "" },
        { partOfSpeech: "" },
      ],
    },
    select: {
      english: true,
      definition: true,
      example: true,
      transcription: true,
      partOfSpeech: true,
    },
    orderBy: { english: "asc" },
  });

  if (gaps.length === 0) {
    console.log(
      "\nУ всех слов есть определение, пример, транскрипция и часть речи.",
    );
    return;
  }

  console.log(`\nОсталось с пробелами: ${gaps.length}`);
  for (const gap of gaps) {
    const missing = [
      gap.definition ? "" : "определение",
      gap.example ? "" : "пример",
      gap.transcription ? "" : "транскрипция",
      gap.partOfSpeech ? "" : "часть речи",
    ]
      .filter(Boolean)
      .join(", ");
    console.log(`  · ${gap.english} — нет: ${missing}`);
  }
  console.log("Добавьте их в content/word-details.json и запустите ещё раз.");
}

async function main() {
  const curated = await loadCurated();
  console.log(`Выверенных записей в content/word-details.json: ${Object.keys(curated).length}`);

  await backfill(
    "Слова в личных словарях",
    await prisma.word.findMany({ select: SELECT }),
    curated,
    (id, data) => prisma.word.update({ where: { id }, data }),
  );

  await backfill(
    "Слова в уроках",
    await prisma.lessonWord.findMany({ select: SELECT }),
    curated,
    (id, data) => prisma.lessonWord.update({ where: { id }, data }),
  );

  await reportGaps();
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb();
  process.exit(1);
});
