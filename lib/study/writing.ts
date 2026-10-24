import type { WritingTask } from "./types";
import { UNITS } from "./units";

const GENERIC_PLAN = [
  "Начните с одного предложения-позиции, а не с «In today's world…».",
  "Один абзац — одна мысль и один пример.",
  "Не используйте слова, в которых не уверены: пишите проще, но точнее.",
  "Оставьте 5 минут на проверку по списку ниже.",
];

const GENERIC_CHECKLIST = [
  "Нет русских калек (проверьте по журналу ошибок)",
  "Артикли и предлоги проверены",
  "Времена глаголов согласованы",
  "Есть минимум три связки",
  "Объём соответствует заданию",
];

export const DIAGNOSTIC_WRITING: WritingTask = {
  id: "w-diag",
  title: "Диагностическое эссе",
  type: "Opinion essay",
  words: "220–260 слов",
  task:
    "Some people think technology has made our lives easier, while others believe it has made them more stressful. Write an essay (220–260 words) giving your opinion. Write it in 40 minutes, without a dictionary, and save it: in week 24 you will write on a similar topic and compare.",
  plan: GENERIC_PLAN,
  phrases: [
    ["it is often argued that …", "часто утверждают, что …"],
    ["a growing body of evidence suggests …", "всё больше данных показывает …"],
    ["on balance, …", "взвесив всё, …"],
    ["this is not to say that …", "это не значит, что …"],
    ["a case could be made for …", "можно привести доводы в пользу …"],
  ],
  checklist: GENERIC_CHECKLIST,
  sample:
    "It is often argued that technology has simplified our lives. While I agree that it has solved many practical problems, I believe it has also created new forms of stress that we are only beginning to understand.\n\nOn the one hand, the benefits are undeniable. Tasks that once took hours, such as booking a ticket or sending a document, now take seconds. For example, a teacher like me can give a lesson to a student in another country without leaving home. Moreover, medical technology has extended lives and improved the quality of life for millions.\n\nOn the other hand, constant connectivity has blurred the line between work and rest. Many people feel obliged to answer messages in the evening and at weekends, which leads to exhaustion. What is more, social media creates pressure to compare ourselves with others, and a growing body of evidence suggests that this harms mental health.\n\nThis is not to say that we should reject technology. Rather, we should learn to use it more consciously: switching off notifications, setting limits on screen time, and protecting time for real conversation.\n\nOn balance, I would say that technology has made life easier in practical terms but not necessarily calmer. The challenge for our generation is to make it serve us, rather than the other way round.",
};

export const FINAL_WRITING: WritingTask = {
  id: "w-final",
  title: "Итоговое эссе (сравните с первым)",
  type: "Discussion essay",
  words: "240–280 слов",
  task:
    "Some people believe that schools should concentrate on teaching practical skills, such as cooking or managing money, rather than academic subjects. Discuss both views and give your own opinion. Write 240–280 words in 40 minutes, then compare with your essay from week 1: count errors, linkers and the range of vocabulary.",
  plan: GENERIC_PLAN,
  phrases: [
    ["there are compelling arguments on both sides", "есть убедительные доводы с обеих сторон"],
    ["to a certain extent", "в определённой степени"],
    ["what is more", "более того"],
    ["it would be unwise to …", "было бы неразумно …"],
    ["taking everything into account", "принимая всё во внимание"],
  ],
  checklist: GENERIC_CHECKLIST,
  sample:
    "There are compelling arguments on both sides of the debate about what schools should teach. Some people feel that practical skills prepare young people better for adult life, while others insist that academic subjects are the foundation of a good education.\n\nAdvocates of practical teaching point out that many school-leavers cannot manage a budget or cook a healthy meal. As a result, they may fall into debt or rely on unhealthy food. What is more, practical lessons can motivate students who find traditional subjects difficult, because they see an immediate use for what they learn.\n\nHowever, there is also a strong case for academic subjects. Mathematics, history and literature teach students to think critically and to express themselves clearly, skills that are valuable in any career. It would be unwise to reduce them, because young people who lack this foundation will find it hard to adapt as technology changes the job market.\n\nTo a certain extent, both sides are right, and I believe the solution is not to choose between them. Schools could include practical courses within the existing timetable, for example by teaching maths through personal finance, or science through cooking. In this way, students would see the connection between theory and everyday life.\n\nTaking everything into account, I would argue that a balanced curriculum serves students best, provided that practical skills are taught alongside, and not instead of, academic knowledge.",
};

/** Короткий текст в «лёгкую» пятницу: пересказ записи недели и своё мнение */
export function weeklyWriting(week: number, trackTitle: string): WritingTask {
  return {
    id: `w-wk${week}`,
    title: `Короткий текст недели ${week}`,
    type: "Short text",
    words: "100–130 слов",
    task: `Write 100–130 words: summarise the main idea of the recording «${trackTitle}» in your own words (no copying from the transcript), then say whether you agree with the speakers and why.`,
    plan: [
      "Первое предложение: кто говорит и о чём (одной фразой).",
      "Два-три факта своими словами: перефразируйте, а не переписывайте.",
      "Ваше мнение в последних двух предложениях, с одной причиной.",
      "Проверьте: нет ли в тексте слов, которые вы слышали, но не уверены, как пишутся.",
    ],
    phrases: [
      ["the speaker argues that …", "говорящий утверждает, что …"],
      ["according to the recording, …", "согласно записи, …"],
      ["in other words, …", "другими словами, …"],
      ["I partly agree because …", "я отчасти согласен, потому что …"],
    ],
    checklist: GENERIC_CHECKLIST.slice(0, 4),
    sample: "",
  };
}

export const UNIT_WRITING: WritingTask[] = UNITS.map((unit) => unit.writing);

/** Все задания для письма: диагностика, десять юнитов, итоговое эссе и короткие тексты первых недель юнитов */
export function allWriting(): WritingTask[] {
  const weekly = UNITS.map((unit) => weeklyWriting(unit.n * 2, unit.tracks[0]?.title ?? unit.title));
  return [DIAGNOSTIC_WRITING, ...UNIT_WRITING, FINAL_WRITING, ...weekly];
}

export function writingById(id: string): WritingTask | undefined {
  const weekly = /^w-wk(\d+)$/.exec(id);
  if (weekly) {
    const week = Number(weekly[1]);
    // Недели юнитов: 2–21, по две на юнит; короткий текст — в первой неделе юнита
    if (week < 2 || week > 21 || week % 2 !== 0) return undefined;
    const unit = UNITS[(week - 2) / 2];
    return weeklyWriting(week, unit.tracks[0]?.title ?? unit.title);
  }
  return [DIAGNOSTIC_WRITING, ...UNIT_WRITING, FINAL_WRITING].find((task) => task.id === id);
}
