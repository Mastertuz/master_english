/**
 * Личные версии домашней работы.
 *
 * Общие задания лежат в HomeworkTask (forUserId = null) и одинаковы для всех.
 * Для одного ученика преподаватель может:
 *  · поправить общее задание — правка хранится в HomeworkTaskOverride.patch,
 *    причём только изменённые поля, остальное берётся из общего задания;
 *  · скрыть общее задание (patch.hidden = true) только у этого ученика;
 *  · добавить личное задание — HomeworkTask с forUserId.
 */

/** Какие поля задания можно менять для одного ученика */
export const PATCH_KEYS = [
  "section",
  "prompt",
  "text",
  "audioUrl",
  "transcript",
  "options",
  "answer",
  "explanation",
  "rule",
  "hidden",
] as const;

export type PatchKey = (typeof PATCH_KEYS)[number];
export type TaskPatch = Partial<{
  section: string;
  prompt: string;
  text: string;
  audioUrl: string;
  transcript: string;
  options: string[];
  answer: string;
  explanation: string;
  rule: string;
  hidden: boolean;
}>;

/** Приводит JSON из базы к безопасному патчу: лишние и кривые поля отбрасываем */
export function asPatch(value: unknown): TaskPatch {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  const patch: TaskPatch = {};

  for (const key of PATCH_KEYS) {
    const item = raw[key];
    if (key === "options") {
      if (Array.isArray(item) && item.every((x) => typeof x === "string")) {
        patch.options = item as string[];
      }
    } else if (key === "hidden") {
      if (typeof item === "boolean") patch.hidden = item;
    } else if (typeof item === "string") {
      patch[key] = item;
    }
  }
  return patch;
}

/** Условие для Prisma: общие задания и личные задания этого ученика */
export function tasksFor(userId: string) {
  return { OR: [{ forUserId: null }, { forUserId: userId }] };
}

/** Что подключить к заданию, чтобы получить личные правки ученика */
export function overridesFor(userId: string) {
  return { where: { userId }, select: { patch: true } } as const;
}

type WithOverrides = {
  order: number;
  forUserId: string | null;
  overrides?: { patch: unknown }[];
};

/**
 * Задания глазами конкретного ученика: личные правки применены, порядок
 * сохранён (личное задание встаёт после общих с тем же номером).
 */
export function effectiveTasks<T extends WithOverrides>(tasks: T[]): T[] {
  return tasks
    .map((task) => {
      const patch = task.overrides?.[0] ? asPatch(task.overrides[0].patch) : {};
      return { ...task, ...patch };
    })
    .sort(
      (a, b) =>
        a.order - b.order ||
        Number(a.forUserId !== null) - Number(b.forUserId !== null),
    );
}
