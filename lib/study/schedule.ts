import { drillById } from "./drills";
import { speakingTask } from "./speaking";
import { unitByNumber } from "./units";
import { weeklyWriting } from "./writing";

/**
 * Расписание на 24 недель. Неделя 1 — диагностика, недели 2–21 — десять юнитов
 * Empower C1 по две недели на юнит, недели 22–24 — экзаменный режим.
 * Каждый день — набор заданий: что открыть в платформе и что сделать в книге.
 */

export type DayKind =
  | "cards"
  | "book"
  | "drill"
  | "listen"
  | "speak"
  | "read"
  | "write"
  | "errors"
  | "immerse"
  | "review"
  | "test";

export type DayTask = {
  id: string;
  kind: DayKind;
  title: string;
  detail?: string;
  minutes: number;
  /** Внутренняя ссылка на страницу платформы */
  href?: string;
  /** Ключ в state.done: когда задание выполнено на платформе, оно отмечается само */
  auto?: string;
};

export type DayPlan = { name: string; focus: string; tasks: DayTask[] };

export type WeekPlan = {
  n: number;
  phase: "p0" | "p1" | "p2" | "p3";
  title: string;
  focus: string;
  unit: number | null;
  half: 1 | 2 | null;
  drills: string[];
  speaking: string[];
  /** Vocabulary in Use Upper-Intermediate: юнит книги и страницы PDF */
  viu?: { unit: number; title: string; pdf: string };
  reading?: string;
  immersion: string;
};

export const DAY_NAMES = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

type Half = {
  drills: [string, string];
  speaking: [string, string, string];
  viu: { unit: number; title: string; pdf: string };
  reading: string;
  immersion: string;
};

/** Двадцать «половин» юнитов Empower C1: по одной на неделю */
const HALVES: Half[] = [
  {
    drills: ["wish-rather", "prepositions"],
    speaking: ["flat-1", "op-language", "think-plan"],
    viu: { unit: 45, title: "Speaking", pdf: "97–98" },
    reading: "Blog post «Speaking Italian to cats» (1A)",
    immersion: "TED: Patricia Kuhl, «The linguistic genius of babies»: послушайте с английскими субтитрами, потом без них.",
  },
  {
    drills: ["perfect-aspect", "inversion"],
    speaking: ["role-inexact", "story-442", "think-speed"],
    viu: { unit: 67, title: "Discourse markers in spoken English", pdf: "141–142" },
    reading: "Article «How quickly is the English language changing?» (1B)",
    immersion: "BBC 6 Minute English: любой выпуск о языках. Выпишите 5 выражений в журнал.",
  },
  {
    drills: ["comparison", "conditionals"],
    speaking: ["flat-2", "desc-photo", "think-circum"],
    viu: { unit: 46, title: "The six senses", pdf: "99–100" },
    reading: "Article «I've been to the quietest place on Earth» (2A)",
    immersion: "TED: Kelly McGonigal, «How to make stress your friend»: тема стресса и экстремальных нагрузок.",
  },
  {
    drills: ["linking", "modals-past"],
    speaking: ["role-advice", "think-decision", "story-news"],
    viu: { unit: 91, title: "Expressions with get", pdf: "189–190" },
    reading: "Article «The wonder of weightlessness» (2B) и report из 2D",
    immersion: "Сериал по выбору с английскими субтитрами: 1 серия. Отмечайте фразы с get и put.",
  },
  {
    drills: ["inversion", "verb-patterns"],
    speaking: ["story-trip", "desc-compare", "think-yesterday"],
    viu: { unit: 92, title: "Expressions with set and put", pdf: "191–192" },
    reading: "Two reviews «Thinking of volunteering abroad?» (3A)",
    immersion: "TED: Chimamanda Adichie, «The danger of a single story»: рассуждение о стереотипах.",
  },
  {
    drills: ["narrative", "phrasal-idioms"],
    speaking: ["role-paraphrase", "desc-scene", "think-register"],
    viu: { unit: 31, title: "Travel", pdf: "69–70" },
    reading: "Narrative article «Survival on the Mano River» (3B) и «Cusco getaway» (3D)",
    immersion: "Документальный сериал о природе (например, Our Planet) с английскими субтитрами: 1 серия.",
  },
  {
    drills: ["noun-have-get", "word-choice"],
    speaking: ["story-memory", "op-disagree", "think-stream"],
    viu: { unit: 42, title: "Belief and opinion", pdf: "91–92" },
    reading: "Article «Learn to trust your gut!» (4A)",
    immersion: "BBC Radio 4, «In Our Time»: любой выпуск о памяти или мозге (слушайте 20 минут).",
  },
  {
    drills: ["wish-rather", "prepositions"],
    speaking: ["flat-3", "desc-person", "think-speed"],
    viu: { unit: 49, title: "Emotions and moods", pdf: "105–106" },
    reading: "Articles «False childhood memories» и «How eyewitness evidence can be unreliable» (4B)",
    immersion: "TED: Susan Cain, «The power of introverts»: послушайте и перескажите за 2 минуты.",
  },
  {
    drills: ["relative-obligation", "conditionals"],
    speaking: ["op-crime", "role-recall", "think-how"],
    viu: { unit: 39, title: "Crime", pdf: "85–86" },
    reading: "Article «Can we have a swimming pool? Life at Halden Prison» (5A)",
    immersion: "Криминальный сериал (например, Broadchurch) с английскими субтитрами: 1 серия.",
  },
  {
    drills: ["modals-past", "phrasal-idioms"],
    speaking: ["op-social-hiring", "flat-furnish", "think-circum"],
    viu: { unit: 16, title: "Work", pdf: "39–40" },
    reading: "Job descriptions «Bomb disposal diver» и «Pet food taster» (5B); essay «Social media and recruitment» (5D)",
    immersion: "BBC Learning English, «The English We Speak»: выпуск об идиомах работы.",
  },
  {
    drills: ["continuous-participle", "verb-patterns"],
    speaking: ["role-presentation", "flat-dream", "think-commentary"],
    viu: { unit: 19, title: "Art and literature", pdf: "45–46" },
    reading: "Article «Lessons Elliott Erwitt has taught me about street photography» (6A)",
    immersion: "TED: Julian Treasure, «How to speak so that people want to listen»: тренируйте приёмы голоса вслух.",
  },
  {
    drills: ["continuous-participle", "word-choice"],
    speaking: ["story-lucky", "teach-wish", "think-decision"],
    viu: { unit: 48, title: "Praising and criticising", pdf: "103–104" },
    reading: "Blog post and email «Two views of a suspicious encounter» (6B); advertisement «You can help!» (6D)",
    immersion: "Фильм по выбору с английскими субтитрами. Выпишите 10 естественных реплик.",
  },
  {
    drills: ["modals-past", "narrative"],
    speaking: ["op-tech", "teach-phrasal", "think-idiom"],
    viu: { unit: 33, title: "Science and technology", pdf: "73–74" },
    reading: "Article «Human augmentation — a dream or a nightmare?» (7A)",
    immersion: "Сериал о технологиях (например, Black Mirror) с английскими субтитрами: 1 серия, затем пересказ.",
  },
  {
    drills: ["cleft", "linking"],
    speaking: ["role-apology", "teach-correct", "flat-move"],
    viu: { unit: 74, title: "Compound adjectives", pdf: "155–156" },
    reading: "Article «Loneliness and temperature» (7B); proposal «A team-building programme» (7D)",
    immersion: "Подкаст по теме работы (BBC Worklife или аналог): 20 минут, затем конспект.",
  },
  {
    drills: ["verb-patterns", "perfect-aspect"],
    speaking: ["op-health", "teach-ccq", "think-plan"],
    viu: { unit: 30, title: "Health and lifestyle", pdf: "67–68" },
    reading: "Articles «Top tips to help you sleep» и «The myth of the eight-hour sleep» (8A)",
    immersion: "TED: Matt Walker, «Sleep is your superpower»: найдите 5 фраз о сне.",
  },
  {
    drills: ["conditionals", "inversion"],
    speaking: ["role-negotiate", "teach-feedback", "flat-street"],
    viu: { unit: 47, title: "What your body does", pdf: "101–102" },
    reading: "Article «Anti-ageing treatments» (8B); home page «Ancestors restaurant» (8D)",
    immersion: "Телепередача о здоровье (например, Trust Me, I'm a Doctor): 1 серия с субтитрами.",
  },
  {
    drills: ["reflexive-ellipsis", "comparison"],
    speaking: ["op-city", "flat-changes", "think-speed"],
    viu: { unit: 25, title: "Towns", pdf: "57–58" },
    reading: "Article «If you want to get close to nature, head into the city» (9A)",
    immersion: "Передача об архитектуре (например, Grand Designs) с субтитрами: 1 серия.",
  },
  {
    drills: ["reflexive-ellipsis", "noun-have-get"],
    speaking: ["role-complain", "teach-parent", "think-register"],
    viu: { unit: 63, title: "Cause, reason, purpose and result", pdf: "133–134" },
    reading: "Article «Kazuo Sejima: Passion and precision» (9B); essay «Urban migration» (9D)",
    immersion: "BBC Radio 4, «In Our Time»: выпуск об истории городов или архитектуре.",
  },
  {
    drills: ["regret-passive", "wish-rather"],
    speaking: ["op-superstition", "role-presentation", "think-circum"],
    viu: { unit: 93, title: "Expressions with come and go", pdf: "193–194" },
    reading: "Article «Don't be boring!» (10A)",
    immersion: "TED: любой доклад, который вы бы хотели повторить как выступление: разберите структуру.",
  },
  {
    drills: ["regret-passive", "cleft"],
    speaking: ["role-turns", "story-442", "think-stream"],
    viu: { unit: 95, title: "Formal and informal words 1", pdf: "197–198" },
    reading: "Article «The game before the game» (10B); film reviews «Knives Out» (10D)",
    immersion: "Посмотрите фильм «Knives Out» с английскими субтитрами (его рецензии в учебнике) и напишите свой отзыв.",
  },
];

const EXAM_IMMERSION = "Полный пробный Cambridge C1 Advanced (если есть): Reading and Use of English за 90 минут, затем разбор ошибок.";

function buildWeeks(): WeekPlan[] {
  const weeks: WeekPlan[] = [];

  weeks.push({
    n: 1,
    phase: "p0",
    title: "Диагностика",
    focus: "Понять, где именно вы теряете баллы: тест, запись речи, эссе.",
    unit: null,
    half: null,
    drills: ["wish-rather", "inversion"],
    speaking: ["exam-1", "think-stream", "think-commentary"],
    immersion: "BBC 6 Minute English: два выпуска; прослушайте с текстом и без текста.",
  });

  for (let index = 0; index < HALVES.length; index += 1) {
    const half = HALVES[index];
    const unit = Math.floor(index / 2) + 1;
    const number = index + 2;
    weeks.push({
      n: number,
      phase: unit <= 4 ? "p1" : unit <= 8 ? "p2" : "p3",
      title: `Empower C1 · юнит ${unit}: ${unitByNumber(unit)?.title ?? ""}`,
      focus:
        index % 2 === 0
          ? "Уроки A и B: тема, грамматика, чтение и первая запись для аудирования."
          : "Уроки C, D и Review: разговорный английский, письмо и повторение юнита.",
      unit,
      half: index % 2 === 0 ? 1 : 2,
      drills: [...half.drills],
      speaking: [...half.speaking],
      viu: half.viu,
      reading: half.reading,
      immersion: half.immersion,
    });
  }

  weeks.push(
    {
      n: 22,
      phase: "p3",
      title: "Экзаменный режим: грамматика и чтение",
      focus: "Закрыть остатки слабых тем и поработать в экзаменном темпе.",
      unit: null,
      half: null,
      drills: ["wish-rather", "inversion", "conditionals", "modals-past"],
      speaking: ["exam-1", "exam-2", "think-speed"],
      immersion: EXAM_IMMERSION,
    },
    {
      n: 23,
      phase: "p3",
      title: "Экзаменный режим: говорение и письмо",
      focus: "Speaking по формату экзамена и письменные работы за время.",
      unit: null,
      half: null,
      drills: ["verb-patterns", "prepositions", "phrasal-idioms", "word-choice"],
      speaking: ["exam-3", "exam-4", "think-circum"],
      immersion: EXAM_IMMERSION,
    },
    {
      n: 24,
      phase: "p3",
      title: "Итоги и следующий шаг",
      focus: "Контрольный тест, сравнение с неделей 1 и план на следующие месяцы.",
      unit: null,
      half: null,
      drills: ["cleft", "regret-passive", "relative-obligation"],
      speaking: ["flat-3", "story-442", "exam-1"],
      immersion: "Повторите любой любимый материал из прошлых недель без субтитров: измерьте, сколько понимаете сейчас.",
    },
  );

  return weeks;
}

export const WEEKS: WeekPlan[] = buildWeeks();

export function weekPlan(n: number): WeekPlan {
  return WEEKS[Math.min(Math.max(n, 1), WEEKS.length) - 1];
}

/** Упражнения по грамматике, которые план ставит в недели юнита */
export function unitDrillIds(unit: number): string[] {
  return Array.from(new Set(WEEKS.filter((week) => week.unit === unit).flatMap((week) => week.drills)));
}

const SPEAK_MIN = 20;

function drillTask(id: string, slot: string, minutes = 15): DayTask {
  const drill = drillById(id);
  return {
    id: `${slot}-drill-${id}`,
    kind: "drill",
    title: drill ? `Упражнения: ${drill.title}` : "Упражнения",
    detail: "Прочитайте правило и пройдите 12 заданий. Ошибки сами попадут в журнал.",
    minutes,
    href: `/plan/grammar/${id}`,
  };
}

function speakTask(id: string, slot: string): DayTask {
  const task = speakingTask(id);
  return {
    id: `${slot}-speak-${id}`,
    kind: "speak",
    title: task ? `Говорение: ${task.title}` : "Говорение",
    detail: task ? `Запись примерно ${task.minutes} мин, затем самопроверка и образец.` : undefined,
    minutes: SPEAK_MIN,
    href: `/plan/speaking/${id}`,
    auto: `sp:${id}`,
  };
}

const CARDS = (slot: string): DayTask => ({
  id: `${slot}-cards`,
  kind: "cards",
  title: "Карточки: слова и фразы",
  detail: "Повторение по интервалам: новые и просроченные карточки.",
  minutes: 10,
  href: "/plan/vocab",
});

const ERRORS = (slot: string, minutes = 10): DayTask => ({
  id: `${slot}-errors`,
  kind: "errors",
  title: "Журнал ошибок: повторить то, что пора",
  minutes,
  href: "/plan/errors",
});

/** Расписание дня: dayIndex 0 — понедельник */
export function dayPlan(week: WeekPlan, dayIndex: number): DayPlan {
  const slot = `w${week.n}-d${dayIndex}`;
  const unit = week.unit ? unitByNumber(week.unit) : undefined;
  const first = week.half === 1;
  const lessons = unit ? unit.lessons : [];
  const byId = (id: string) => lessons.find((item) => item.id === id);
  const trackFor = (position: number) => unit?.tracks[position];
  const unitHref = unit ? `/plan/units/${unit.n}` : "/plan/units";

  // Недели вне юнитов: диагностика и экзаменный режим
  if (!unit) return specialDay(week, dayIndex, slot);

  const lessonLabel = (ids: string[]) =>
    ids
      .map((id) => byId(id))
      .filter(Boolean)
      .map((lesson) => `${lesson!.id} (${lesson!.pages})`)
      .join(", ");

  switch (dayIndex) {
    case 0: {
      const mainLesson = first ? byId(`${unit.n}A`) : byId(`${unit.n}C`);
      return {
        name: DAY_NAMES[0],
        focus: "Грамматика и словарь",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-book`,
            kind: "book",
            title: `Empower C1 · урок ${mainLesson?.id}: ${mainLesson?.title}`,
            detail: `Откройте Student's Book, ${mainLesson?.pages}. ${mainLesson?.grammar ? `Грамматика: ${mainLesson.grammar}. ` : ""}Сделайте упражнения урока (ключей в Student's Book нет, поэтому грамматику закрепите упражнениями на платформе).`,
            minutes: 25,
            href: unitHref,
          },
          drillTask(week.drills[0], slot),
        ],
      };
    }
    case 1: {
      const track = first ? trackFor(0) : trackFor(2);
      return {
        name: DAY_NAMES[1],
        focus: "Аудирование",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-listen`,
            kind: "listen",
            title: track ? `Запись ${track.track.replace("-", ".")}: ${track.title}` : "Аудирование",
            detail: "Сначала слушайте без текста и отвечайте на вопросы. Потом читайте текст и повторяйте фразы вслух. В конце перескажите запись.",
            minutes: 30,
            href: `${unitHref}#track-${track?.track}`,
            auto: track ? `ls:${track.track}` : undefined,
          },
        ],
      };
    }
    case 2:
      return {
        name: DAY_NAMES[2],
        focus: "Говорение",
        tasks: [CARDS(slot), speakTask(week.speaking[0], slot), speakTask(week.speaking[1], `${slot}b`)],
      };
    case 3: {
      const mainLesson = first ? byId(`${unit.n}B`) : byId(`${unit.n}D`);
      return {
        name: DAY_NAMES[3],
        focus: "Чтение и словарь",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-read`,
            kind: "read",
            title: `Чтение: ${week.reading ?? "статья урока"}`,
            detail: `Empower C1, урок ${mainLesson?.id}, ${mainLesson?.pages}. Прочитайте текст, сделайте задания и выпишите 5 фраз (с примером) в «Слова» или в журнал.`,
            minutes: 25,
          },
          ...(week.viu
            ? [
                {
                  id: `${slot}-viu`,
                  kind: "book" as const,
                  title: `Vocabulary in Use: юнит ${week.viu.unit} «${week.viu.title}»`,
                  detail: `PDF, стр. ${week.viu.pdf}. Левая страница: слова и фразы, правая: упражнения; ответы сверьте по Answer key.`,
                  minutes: 20,
                },
              ]
            : []),
          drillTask(week.drills[1], slot, 10),
        ],
      };
    }
    case 4: {
      const track = unit.tracks[first ? 0 : 1];
      const task = first ? weeklyWriting(week.n, track?.title ?? unit.title) : unit.writing;
      return {
        name: DAY_NAMES[4],
        focus: "Письмо",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-write`,
            kind: "write",
            title: `${first ? "Короткий текст" : "Письмо"}: ${task.title}`,
            detail: `${task.type}, ${task.words}. Пишите на платформе, без словаря, затем проверьте по списку и сравните с образцом.`,
            minutes: first ? 25 : 40,
            href: `/plan/writing/${task.id}`,
            auto: `wr:${task.id}`,
          },
          ERRORS(slot, 5),
        ],
      };
    }
    case 5: {
      const track = trackFor(1);
      return {
        name: DAY_NAMES[5],
        focus: "Погружение",
        tasks: [
          {
            id: `${slot}-shadow`,
            kind: "listen",
            title: track ? `Шэдоуинг: запись ${track.track.replace("-", ".")}, «${track.title}»` : "Шэдоуинг",
            detail: "Прослушайте две-три фразы из записи и повторяйте за диктором с повтором фразы (значок ⟳), пока не получится в том же темпе.",
            minutes: 15,
            href: `${unitHref}#track-${track?.track}`,
          },
          {
            id: `${slot}-immerse`,
            kind: "immerse",
            title: "Свободное погружение",
            detail: week.immersion,
            minutes: 45,
          },
          {
            id: `${slot}-talk`,
            kind: "speak",
            title: "Разговор на английском",
            detail: "Урок с учеником целиком на английском или разговор с партнёром (italki, друг): 30 минут. Запомните три фразы, которых не хватило.",
            minutes: 30,
          },
        ],
      };
    }
    default:
      return {
        name: DAY_NAMES[6],
        focus: "Повторение и планирование",
        tasks: [
          ERRORS(slot, 20),
          speakTask(week.speaking[2], slot),
          {
            id: `${slot}-plan`,
            kind: "review",
            title: "Итог недели и план следующей",
            detail: `Просмотрите «Журнал ошибок» и список слов недели. ${lessonLabel(first ? [`${unit.n}A`, `${unit.n}B`] : [`${unit.n}C`, `${unit.n}D`, "R"])}: если что-то не доделали, перенесите на следующую неделю.`,
            minutes: 10,
            href: "/plan/today",
          },
        ],
      };
  }
}

function specialDay(week: WeekPlan, dayIndex: number, slot: string): DayPlan {
  const diagnostic = week.n === 1;
  const final = week.n === 24;

  switch (dayIndex) {
    case 0:
      return {
        name: DAY_NAMES[0],
        focus: diagnostic ? "Разобрать ошибки теста" : "Грамматика",
        tasks: [
          CARDS(slot),
          diagnostic
            ? {
                id: `${slot}-test`,
                kind: "test",
                title: "Разбор теста B2–C1",
                detail: "Если ещё не прошли тест, пройдите (43 вопроса). Затем прочитайте объяснения ко всем ошибкам и добавьте их в журнал.",
                minutes: 30,
                href: "/plan#tests",
              }
            : drillTask(week.drills[0], slot, 25),
          drillTask(diagnostic ? week.drills[0] : week.drills[1], `${slot}b`),
        ],
      };
    case 1:
      return {
        name: DAY_NAMES[1],
        focus: "Аудирование",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-listen`,
            kind: "listen",
            title: diagnostic ? "Первое знакомство: запись 1.06 с интервью" : "Повторите записи, где у вас было меньше всего верных ответов",
            detail: diagnostic
              ? "Послушайте запись из юнита 1 сначала без текста, потом с текстом."
              : "Откройте любой юнит и снова пройдите запись, в которой были ошибки. Цель: ответить без подсказок.",
            minutes: 30,
            href: diagnostic ? "/plan/units/1#track-01-06" : "/plan/units",
          },
        ],
      };
    case 2:
      return {
        name: DAY_NAMES[2],
        focus: "Говорение",
        tasks: [CARDS(slot), speakTask(week.speaking[0], slot), speakTask(week.speaking[1], `${slot}b`)],
      };
    case 3:
      return {
        name: DAY_NAMES[3],
        focus: "Чтение",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-read`,
            kind: "read",
            title: diagnostic ? "Статья для чтения: Guardian Long Read или BBC Future" : "Reading and Use of English: тренировка в экзаменном темпе",
            detail: diagnostic
              ? "Одна статья 1000–1500 слов; выпишите 5 естественных выражений."
              : "Если есть сборник Cambridge C1 Advanced, сделайте Reading and Use of English за 90 минут; иначе возьмите длинную статью и ответьте на вопросы к ней.",
            minutes: diagnostic ? 30 : 60,
          },
          drillTask(week.drills[2] ?? week.drills[0], slot, 15),
        ],
      };
    case 4: {
      const task = diagnostic ? { id: "w-diag", title: "Диагностическое эссе", type: "Opinion essay", words: "220–260 слов" } : final ? { id: "w-final", title: "Итоговое эссе", type: "Discussion essay", words: "240–280 слов" } : { id: "w-u5", title: "Эссе-мнение (повторить за время)", type: "Opinion essay", words: "250–280 слов" };
      return {
        name: DAY_NAMES[4],
        focus: "Письмо",
        tasks: [
          CARDS(slot),
          {
            id: `${slot}-write`,
            kind: "write",
            title: `${task.title}`,
            detail: `${task.type}, ${task.words}. Ровно 40 минут, без словаря.${final ? " Затем сравните с эссе недели 1." : ""}`,
            minutes: 45,
            href: `/plan/writing/${task.id}`,
            auto: `wr:${task.id}`,
          },
          ERRORS(slot, 5),
        ],
      };
    }
    case 5:
      return {
        name: DAY_NAMES[5],
        focus: "Погружение",
        tasks: [
          {
            id: `${slot}-immerse`,
            kind: "immerse",
            title: "Свободное погружение",
            detail: week.immersion,
            minutes: 60,
          },
          {
            id: `${slot}-talk`,
            kind: "speak",
            title: "Разговор на английском",
            detail: "30 минут с носителем, сильным репетитором или другом. Запишите (с согласия), потом послушайте.",
            minutes: 30,
          },
        ],
      };
    default:
      return {
        name: DAY_NAMES[6],
        focus: final ? "Итоги" : "Повторение и планирование",
        tasks: [
          ERRORS(slot, 20),
          speakTask(week.speaking[2], slot),
          final
            ? {
                id: `${slot}-test`,
                kind: "test",
                title: "Контрольный тест B2–C1: сравните с результатом недели 1",
                detail: "Пройдите тот же тест ещё раз. Сравните число баллов и составьте план на следующие месяцы (C1 → C2 или узкая профессиональная тема).",
                minutes: 30,
                href: "/plan#tests",
              }
            : {
                id: `${slot}-plan`,
                kind: "review",
                title: diagnostic ? "Поставить цель и срок" : "Итог недели и план следующей",
                detail: diagnostic
                  ? "Определите: сдаёте ли Cambridge C1 или IELTS, или просто контрольный тест через 24 недели. Нажмите «Начать план» на странице «Сегодня»."
                  : "Просмотрите журнал ошибок и список слов. Что не получилось, перенесите на следующую неделю.",
                minutes: 10,
                href: "/plan/today",
              },
        ],
      };
  }
}
