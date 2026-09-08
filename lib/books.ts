import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Учебники лежат в папке books в корне проекта. Список используется
 * подсказкой в поле «Учебник» при создании урока.
 */
export async function listBooks(): Promise<string[]> {
  try {
    const entries = await readdir(path.join(process.cwd(), "books"));
    return entries
      .filter((name) => /\.(pdf|epub|djvu)$/i.test(name))
      .map((name) => name.replace(/\.[^.]+$/, ""))
      .sort((a, b) => a.localeCompare(b, "ru"));
  } catch {
    return [];
  }
}
