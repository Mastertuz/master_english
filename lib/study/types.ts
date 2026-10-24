/**
 * Типы учебного содержимого личного плана «Мой английский».
 * Тексты заданий лежат рядом (lib/study/*.ts), состояние — в браузере (study-store).
 */

/** Пара «по-английски — по-русски» для фраз и слов */
export type Pair = [en: string, ru: string];

export type SpeakingGroup =
  | "flat"
  | "think"
  | "describe"
  | "opinion"
  | "story"
  | "teach"
  | "roleplay"
  | "exam";

/** Как проходит задание: запись монолога или одна из мини-игр */
export type SpeakingMode = "record" | "speed" | "circumlocution" | "register" | "steps";

export type SpeakingStep = {
  title: string;
  /** Что сделать на этом шаге, по-английски — как вопрос, который задали бы вам */
  ask: string;
  /** Слова комнаты или темы шага */
  words?: Pair[];
};

export type SpeakingTask = {
  id: string;
  group: SpeakingGroup;
  title: string;
  mode: SpeakingMode;
  level: "B2+" | "C1";
  /** Время на подготовку, секунд */
  prepSec: number;
  /** Сколько говорить, минут */
  minutes: number;
  /** По-русски: что делать и зачем */
  brief: string;
  /** По-английски: задание целиком, как на экзамене */
  task: string;
  steps?: SpeakingStep[];
  /** Фразы, которые стоит вставить в рассказ */
  phrases: Pair[];
  /** На какую грамматику обратить внимание (по-английски, коротко) */
  grammar?: string[];
  /** Образец ответа носителя уровня C1 */
  sample: string;
  /** Что ещё проверить в записи именно в этом задании */
  checks?: string[];
};

export type DrillItem = {
  id: string;
  /** Предложение с пропуском ___ */
  q: string;
  /** Варианты ответа; если их нет, ответ вписывают */
  options?: string[];
  /** Верный ответ; другие допустимые — через «|» */
  answer: string;
  /** Короткое объяснение по-русски */
  why: string;
};

export type Drill = {
  id: string;
  title: string;
  /** Откуда тема: ваша ошибка в тесте, юнит Empower */
  tag: string;
  /** Краткое правило по-русски, абзацы */
  rule: string[];
  /** Формулы и примеры по-английски */
  examples: string[];
  items: DrillItem[];
};

export type ListeningQuestion = {
  q: string;
  options: string[];
  /** Индекс верного варианта */
  answer: number;
  why: string;
};

export type ListeningTrack = {
  /** Например, «01-06» — совпадает с именем файла записи */
  track: string;
  title: string;
  /** Где в учебнике: урок и страница */
  where: string;
  /** Ссылка на файл в public/ */
  audio: string;
  /** Во что тренироваться: ясная цель для шэдоуинга */
  focus: string;
  questions: ListeningQuestion[];
  /** Фразы из записи, которые стоит выписать */
  phrases: Pair[];
};

export type UnitLesson = {
  id: string;
  title: string;
  goal: string;
  grammar?: string;
  vocabulary?: string;
  /** Страницы Student's Book */
  pages: string;
};

export type WritingTask = {
  id: string;
  title: string;
  type: string;
  words: string;
  /** Задание по-английски, как в экзамене */
  task: string;
  /** Подсказка по-русски: структура и ловушки */
  plan: string[];
  /** Полезные связки и фразы */
  phrases: Pair[];
  /** Список проверки перед сдачей */
  checklist: string[];
  /** Образец */
  sample: string;
};

export type VocabItem = { en: string; ru: string; example: string };

export type EmpowerUnit = {
  n: number;
  title: string;
  /** О чём юнит, по-русски */
  about: string;
  lessons: UnitLesson[];
  tracks: ListeningTrack[];
  /** Слова и фразы юнита: из них собираются карточки */
  vocab: VocabItem[];
  writing: WritingTask;
};
