/**
 * Диагностика подключения к базе: npm run db:check
 *
 * Прогоняет несколько конфигураций по очереди, чтобы стало видно, какая
 * именно ломается: голый pg, pg с настройками приложения, Prisma с пулом
 * от адаптера, Prisma с минимальным пулом, Prisma с пулом приложения.
 *
 * ВАЖНО: запускать при остановленном `npm run dev` — иначе соединения
 * dev-сервера участвуют в общем лимите и картина смазывается.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool, type PoolConfig } from "pg";
import { pgConnectionString } from "../lib/db-url";

const url = process.env.DATABASE_URL;

const APP_POOL: PoolConfig = {
  max: 5,
  connectionTimeoutMillis: 15_000,
  idleTimeoutMillis: 30_000,
};

type Outcome = { name: string; ok: boolean; ms: number; note: string };
const results: Outcome[] = [];

function describe(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = (error as { cause?: unknown }).cause;
  const causeText =
    cause instanceof Error ? ` (причина: ${cause.message})` : "";
  return `${error.message}${causeText}`;
}

async function step(name: string, run: () => Promise<string>) {
  process.stdout.write(`• ${name}… `);
  const started = Date.now();
  try {
    const note = await run();
    const ms = Date.now() - started;
    console.log(`✅ ${ms} мс — ${note}`);
    results.push({ name, ok: true, ms, note });
  } catch (error) {
    const ms = Date.now() - started;
    console.log(`❌ ${ms} мс`);
    console.log(`    ${describe(error)}`);
    results.push({ name, ok: false, ms, note: describe(error) });
  }
}

async function withPool<T>(
  config: PoolConfig,
  run: (pool: Pool) => Promise<T>,
): Promise<T> {
  const pool = new Pool({ connectionString: pgConnectionString(url ?? ""), ...config });
  pool.on("error", () => undefined);
  try {
    return await run(pool);
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function countViaPrisma(adapter: PrismaPg): Promise<string> {
  const prisma = new PrismaClient({ adapter, log: ["error"] });
  try {
    const users = await prisma.user.count();
    const words = await prisma.word.count();
    return `пользователей ${users}, слов ${words}`;
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

async function main() {
  if (!url) {
    console.error("❌ DATABASE_URL не задан в .env");
    process.exit(1);
  }

  console.log("URL:", url.replace(/\/\/([^@]*)@/, "//***:***@"));
  console.log("Совет: остановите `npm run dev` перед запуском.");
  console.log("");

  await step("1. pg, минимальный пул", () =>
    withPool({ connectionTimeoutMillis: 15_000 }, async (pool) => {
      const r = await pool.query("select current_database() as db");
      return `база "${r.rows[0].db}"`;
    }),
  );

  await step("2. pg, настройки приложения", () =>
    withPool(APP_POOL, async (pool) => {
      const r = await pool.query<{ table_name: string }>(
        "select table_name from information_schema.tables where table_schema='public'",
      );
      return `таблиц: ${r.rowCount}`;
    }),
  );

  await step("3. pg, тот же запрос, что делает Prisma", () =>
    withPool(APP_POOL, async (pool) => {
      const r = await pool.query('select count(*)::int as n from "public"."User"');
      return `строк в User: ${r.rows[0].n}`;
    }),
  );

  await step("4. Prisma, пул создаёт сам адаптер", () =>
    countViaPrisma(new PrismaPg({ connectionString: url })),
  );

  await step("5. Prisma, минимальный внешний пул", () =>
    withPool({ connectionTimeoutMillis: 15_000 }, (pool) =>
      countViaPrisma(new PrismaPg(pool, { disposeExternalPool: false })),
    ),
  );

  await step("6. Prisma, пул с настройками приложения", () =>
    withPool(APP_POOL, (pool) =>
      countViaPrisma(new PrismaPg(pool, { disposeExternalPool: false })),
    ),
  );

  for (const attempt of [1, 2, 3]) {
    await step(`7.${attempt} Prisma повторно (проверка стабильности)`, () =>
      countViaPrisma(new PrismaPg({ connectionString: url })),
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log("");
  const failed = results.filter((r) => !r.ok);
  if (failed.length === 0) {
    console.log("✅ Все проверки прошли.");
  } else {
    console.log(`❌ Не прошло проверок: ${failed.length} из ${results.length}`);
    console.log("   " + failed.map((f) => f.name).join("\n   "));
  }
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("❌ Непредвиденная ошибка:");
  console.error(error);
  process.exit(1);
});
