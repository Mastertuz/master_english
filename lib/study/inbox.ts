import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Папка с работами, которые вы отправили на проверку. Работает на вашем компьютере
 * (там, где запущен сайт и где лежит проект): работы кладутся файлами рядом с кодом,
 * а проверяющий (Claude) читает их и пишет отзыв в соседний файл .review.json.
 * На хостинге диск только для чтения, поэтому там отправка не работает: страница
 * предлагает скопировать работу и отправить её в чат.
 */
const DIR = path.join(process.cwd(), "self-study-inbox");

export type Submission = {
  id: string;
  taskId: string;
  title: string;
  prompt: string;
  text: string;
  kind: "writing" | "video" | "speaking";
  at: string;
};

export type Review = {
  at: string;
  /** Общий вывод в двух-трёх предложениях */
  summary: string;
  /** Оценка по смыслу, например «B2+ / C1-» или «7 из 10» */
  score?: string;
  /** Исправленный вариант текста */
  corrected?: string;
  /** Замечания по пунктам */
  notes: string[];
  /** Ошибки для журнала: неверно, верно, почему */
  errors: { wrong: string; right: string; why: string }[];
  /** Что сделать дальше */
  next?: string;
};

export type SubmissionWithReview = Submission & { review: Review | null };

function safe(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60);
}

export async function saveSubmission(input: Omit<Submission, "id" | "at">): Promise<Submission> {
  await mkdir(DIR, { recursive: true });
  const at = new Date().toISOString();
  const id = `${at.replace(/[:.]/g, "-")}__${safe(input.taskId)}`;
  const submission: Submission = {
    id,
    at,
    taskId: safe(input.taskId),
    title: input.title.slice(0, 200),
    prompt: input.prompt.slice(0, 4000),
    text: input.text.slice(0, 20000),
    kind: input.kind,
  };
  await writeFile(path.join(DIR, `${id}.json`), JSON.stringify(submission, null, 2), "utf8");
  return submission;
}

export async function listSubmissions(taskId?: string): Promise<SubmissionWithReview[]> {
  let files: string[] = [];
  try {
    files = await readdir(DIR);
  } catch {
    return [];
  }
  const result: SubmissionWithReview[] = [];
  for (const file of files.filter((name) => name.endsWith(".json") && !name.endsWith(".review.json"))) {
    try {
      const submission = JSON.parse(await readFile(path.join(DIR, file), "utf8")) as Submission;
      if (taskId && submission.taskId !== safe(taskId)) continue;
      let review: Review | null = null;
      try {
        review = JSON.parse(await readFile(path.join(DIR, file.replace(/\.json$/, ".review.json")), "utf8")) as Review;
      } catch {
        review = null;
      }
      result.push({ ...submission, review });
    } catch {
      // повреждённый файл пропускаем
    }
  }
  return result.sort((a, b) => b.at.localeCompare(a.at));
}
