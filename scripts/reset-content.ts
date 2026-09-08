/**
 * Чистит учебный контент, сохраняя аккаунты: npm run db:reset-content
 *
 * Нужен при переходе на новую схему, где урок стал общим (номер урока
 * теперь уникален глобально) — старые уроки каждого ученика дублируют
 * номера и мешают `prisma db push`.
 *
 * Пользователи, сессии и коды восстановления НЕ удаляются.
 * Работает напрямую через pg, поэтому не зависит от версии схемы.
 */
import "dotenv/config";
import { Pool } from "pg";
import { pgConnectionString } from "../lib/db-url";

// Порядок не важен: удаляем одним TRUNCATE ... CASCADE
const CONTENT_TABLES = [
  "HomeworkAnswer",
  "HomeworkSubmission",
  "HomeworkTask",
  "Homework",
  "TrainingAttempt",
  "TestAttempt",
  "Question",
  "Test",
  "LessonAssignment",
  "LessonWord",
  "Word",
  "Lesson",
  "DictionaryCache",
];

async function main() {
  const pool = new Pool({
    connectionString: pgConnectionString(process.env.DATABASE_URL ?? ""),
    connectionTimeoutMillis: 15_000,
  });

  try {
    const existing = await pool.query<{ table_name: string }>(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_name = any($1)`,
      [CONTENT_TABLES],
    );

    if (existing.rowCount === 0) {
      console.log("Таблиц с контентом нет — чистить нечего.");
      return;
    }

    const names = existing.rows
      .map((row) => `"${row.table_name}"`)
      .join(", ");

    await pool.query(`truncate table ${names} restart identity cascade`);

    const users = await pool.query<{ count: string }>(
      'select count(*)::int as count from "User"',
    );

    console.log("");
    console.log(`✅ Очищено таблиц: ${existing.rowCount}`);
    console.log(`   ${names}`);
    console.log(`   Аккаунты сохранены: ${users.rows[0].count}`);
    console.log("");
    console.log("   Дальше: npm run db:push && npm run db:seed");
    console.log("");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("❌ Не удалось очистить контент:");
  console.error(error);
  process.exit(1);
});
