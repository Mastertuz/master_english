/**
 * node-postgres предупреждает, что в pg 9 режим `sslmode=require` сменит
 * смысл на более слабый. Сейчас он равен `verify-full`, поэтому просто
 * пишем режим явно — поведение то же, предупреждения нет.
 *
 * Меняем строку только для драйвера: в .env остаётся `require`, потому что
 * Prisma CLI разбирает её по правилам libpq, где значения не совпадают.
 */
export function pgConnectionString(url: string): string {
  return url.replace(/sslmode=require\b/i, "sslmode=verify-full");
}
