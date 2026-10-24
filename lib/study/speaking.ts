import { FLAT_TASKS } from "./speaking-flat";
import { THINK_TASKS } from "./speaking-think";
import { DESCRIBE_TASKS, OPINION_TASKS, STORY_TASKS } from "./speaking-talk";
import { EXAM_TASKS, ROLE_TASKS, TEACH_TASKS } from "./speaking-pro";
import type { SpeakingGroup, SpeakingTask } from "./types";

export { CIRCUMLOCUTION_WORDS, REGISTER_ITEMS, SPEED_QUESTIONS } from "./speaking-games";

export const SPEAKING_TASKS: SpeakingTask[] = [
  ...FLAT_TASKS,
  ...THINK_TASKS,
  ...DESCRIBE_TASKS,
  ...OPINION_TASKS,
  ...STORY_TASKS,
  ...TEACH_TASKS,
  ...ROLE_TASKS,
  ...EXAM_TASKS,
];

export const SPEAKING_GROUPS: { id: SpeakingGroup; title: string; icon: string; text: string }[] = [
  {
    id: "flat",
    title: "Прогулка по квартире",
    icon: "🏠",
    text: "Комната за комнатой: что где стоит, что вам нравится, какие истории и «если бы» с этим связаны. Три круга от простого к сложному.",
  },
  {
    id: "think",
    title: "Мышление по-английски",
    icon: "💭",
    text: "Комментарий вслух, план дня, решение, поток мыслей, объяснение процесса и мини-игры. Приучают думать без перевода.",
  },
  {
    id: "describe",
    title: "Описание",
    icon: "🖼",
    text: "Фото, человек, сцена из фильма, сравнение двух мест: словарь и конструкции для описания.",
  },
  {
    id: "opinion",
    title: "Мнения и аргументы",
    icon: "⚖️",
    text: "Минутные выступления по схеме PEEL: позиция, довод, пример, вывод. Темы юнитов Empower.",
  },
  {
    id: "story",
    title: "Истории",
    icon: "📖",
    text: "Анекдоты, воспоминания, поездки, новости. Техника 4/3/2 для беглости.",
  },
  {
    id: "teach",
    title: "Английский репетитора",
    icon: "🎓",
    text: "Объяснения без русского, исправление ошибок, CCQ, обратная связь: язык вашего урока.",
  },
  {
    id: "roleplay",
    title: "Ролевые ситуации",
    icon: "🎭",
    text: "Советы, торг, извинения, жалобы, презентации: язык раздела Everyday English.",
  },
  {
    id: "exam",
    title: "Экзамен Cambridge C1",
    icon: "🏅",
    text: "Все четыре части Speaking по формату экзамена: подготовка к проверке уровня.",
  },
];

export function speakingTask(id: string): SpeakingTask | undefined {
  return SPEAKING_TASKS.find((task) => task.id === id);
}

/** Общий список самопроверки для любой записи */
export const GENERAL_CHECKS = [
  "Не молчал(а) дольше трёх секунд",
  "Использовал(а) хотя бы три фразы из списка",
  "Не перешёл(ла) на русский",
  "Закончил(а) каждую мысль, не бросал(а) на полуслове",
  "Исправил(а) себя, когда заметил(а) ошибку, и пошёл(ла) дальше",
];
