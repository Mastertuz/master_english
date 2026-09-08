import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { pgConnectionString } from "./db-url";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL не задан. Проверьте файл .env в корне проекта.");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

/**
 * Пул соединений создаётся один раз на процесс. В dev-режиме Next.js
 * перезагружает модули при каждом изменении файла, поэтому пул и клиент
 * кладём в globalThis — иначе соединения к базе копятся и запросы зависают.
 *
 * База лежит за удалённым пулером Prisma Postgres, и всё время съедает
 * открытие соединения: запрос по готовому соединению — 80 мс, а новое
 * соединение — от секунды (самое первое после старта доходило до 13 с).
 * Поэтому соединения бережём: держим живыми и прогреваем заранее.
 */
function createPool() {
  const pool = new Pool({
    connectionString: pgConnectionString(connectionString!),
    // TLS настраивается через ?sslmode=... в самой строке подключения:
    // node-postgres разбирает connectionString ПОСЛЕ остальных опций и
    // перезаписывает ими поле ssl, так что задавать его здесь бесполезно.
    // pgConnectionString подставляет явный verify-full вместо require.
    max: POOL_MAX,
    // TCP-keepalive: иначе соединение к удалённому пулеру тихо умирает,
    // и следующий запрос падает с «Connection terminated unexpectedly»
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
    // Соединения живут дольше: страница делает 4–5 запросов сразу, и при
    // прежних 30 секундах каждый заход после паузы открывал их заново
    idleTimeoutMillis: 5 * 60_000,
    // Битое соединение должно отваливаться быстро, а не держать страницу
    connectionTimeoutMillis: 8_000,
    // Соединение старше получаса пулер всё равно закроет сам — обновляем
    // его в фоне, пока оно простаивает
    maxLifetimeSeconds: 30 * 60,
    // Таймауты только клиентские. ВАЖНО: не добавлять сюда statement_timeout
    // и idle_in_transaction_session_timeout — node-postgres отправляет их
    // в стартовом пакете соединения, а пулер Prisma Postgres такие параметры
    // не принимает и отвечает «Failed to connect to upstream database».
  });

  pool.on("error", (error) => {
    console.error("[pg] ошибка пула соединений:", error.message);
  });

  warmUp(pool);

  return pool;
}

/**
/**
 * На бессерверном хостинге (Vercel) процесс живёт от запроса до запроса, и
 * таких процессов бывает много одновременно. Держать в каждом по пять
 * соединений — верный способ упереться в лимит базы, поэтому там пул
 * короткий, а прогрев и heartbeat не нужны.
 */
const SERVERLESS = Boolean(process.env.VERCEL);

/**
 * Размер пула. База принимает около 13 соединений одновременно, а одна
 * страница делает до пяти запросов сразу — больше пяти на процесс не нужно.
 */
const POOL_MAX = SERVERLESS ? 1 : 5;

/**
 * Сколько соединений открываем заранее. По умолчанию — весь пул: страница
 * запускает запросы параллельно, и недостающие соединения она открывала бы
 * сама, по ~850 мс каждое.
 */
const WARM_CONNECTIONS = SERVERLESS
  ? 0
  : Math.min(POOL_MAX, Number(process.env.DB_WARM_CONNECTIONS ?? POOL_MAX));

/**
 * Пулер Prisma Postgres закрывает простаивающие соединения сам, и клиентский
 * idleTimeoutMillis тут не помогает: после полутора минут тишины страница с
 * пятью запросами снова платила несколько секунд за переподключение. Раз в
 * 45 секунд трогаем соединения — этого хватает, чтобы они не закрывались.
 */
const HEARTBEAT_MS = 45_000;

function ping(pool: Pool) {
  if (!Number.isFinite(WARM_CONNECTIONS) || WARM_CONNECTIONS < 1) return;

  // Ошибки глушим: прогрев — оптимизация, а не обязательный шаг
  void Promise.all(
    Array.from({ length: WARM_CONNECTIONS }, () =>
      pool.query("select 1").catch(() => undefined),
    ),
  );
}

function warmUp(pool: Pool) {
  // Долгоживущего процесса нет — некого и незачем прогревать
  if (SERVERLESS) return;

  ping(pool);

  // unref, чтобы таймер не держал процесс живым при выходе
  setInterval(() => ping(pool), HEARTBEAT_MS).unref();
}

function createClient(pool: Pool) {
  return new PrismaClient({
    adapter: new PrismaPg(pool, { disposeExternalPool: false }),
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["error", "warn"],
  });
}

const pool = globalForPrisma.pgPool ?? createPool();
export const prisma = globalForPrisma.prisma ?? createClient(pool);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

/**
 * Закрывает соединения. Нужна скриптам из scripts/: prisma.$disconnect()
 * не трогает внешний пул (disposeExternalPool: false), а прогретые
 * соединения держат процесс живым — скрипт не завершался сам.
 * Приложению вызывать не нужно: пул живёт столько же, сколько процесс.
 */
export async function closeDb(): Promise<void> {
  await prisma.$disconnect().catch(() => undefined);
  await pool.end().catch(() => undefined);
}
