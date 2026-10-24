"use client";

import { useSyncExternalStore } from "react";

/**
 * Прогресс личного плана хранится в браузере (localStorage): база для него не нужна,
 * а записи речи и черновики остаются у вас на устройстве.
 * Один JSON на всё: отметки дней, результаты упражнений, карточки, журнал ошибок.
 */

export type DrillRun = { at: string; score: number; total: number };

export type ErrorCard = {
  id: string;
  /** Откуда ошибка: название упражнения или «тест» */
  source: string;
  prompt: string;
  /** Варианты ответа; у вписываемых заданий и ваших записей их нет */
  options?: string[];
  answer: string;
  /** Ответ — целая фраза: сверяем её целиком, а не по вариантам через запятую */
  exact?: boolean;
  why: string;
  /** Ящик интервального повторения: 0 — новая, 5 — выучена */
  box: number;
  due: string;
  wrong: number;
  added: string;
};

export type VocabCard = { box: number; due: string; seen: number };

export type StudyState = {
  v: 2;
  /** Понедельник первой недели плана, YYYY-MM-DD */
  startDate: string | null;
  /** id задания дня → дата выполнения */
  done: Record<string, string>;
  drills: Record<string, DrillRun[]>;
  errors: Record<string, ErrorCard>;
  cards: Record<string, VocabCard>;
  writing: Record<string, { text: string; at: string }>;
  speaking: Record<string, { times: number; last: string; checks: Record<string, boolean>; note: string }>;
  listening: Record<string, { score: number; total: number; at: string }>;
  /** Дата → минуты занятий, которые вы отметили сами */
  minutes: Record<string, number>;
};

export const EMPTY_STATE: StudyState = {
  v: 2,
  startDate: null,
  done: {},
  drills: {},
  errors: {},
  cards: {},
  writing: {},
  speaking: {},
  listening: {},
  minutes: {},
};

const KEY = "self-study-v2";
const EVENT = "self-study-v2-change";

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

let cachedRaw = "";
let cachedState: StudyState = EMPTY_STATE;

function parse(raw: string): StudyState {
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) {
    cachedState = EMPTY_STATE;
    return cachedState;
  }
  try {
    const value = JSON.parse(raw) as Partial<StudyState>;
    cachedState = { ...EMPTY_STATE, ...value, v: 2 };
  } catch {
    cachedState = EMPTY_STATE;
  }
  return cachedState;
}

function write(next: StudyState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // приватный режим или переполнение: изменение просто не сохранится
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Текущее состояние и функция его изменения */
export function useStudy(): [StudyState, (change: (state: StudyState) => StudyState) => void] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const state = parse(raw);

  function update(change: (state: StudyState) => StudyState) {
    write(change(parse(readRaw())));
  }
  return [state, update];
}

/** Для кнопок «скачать копию» и «загрузить копию» */
export function exportState(): string {
  return JSON.stringify(parse(readRaw()), null, 2);
}

export function importState(json: string): boolean {
  try {
    const value = JSON.parse(json) as Partial<StudyState>;
    if (!value || typeof value !== "object" || value.v !== 2) return false;
    write({ ...EMPTY_STATE, ...value, v: 2 });
    return true;
  } catch {
    return false;
  }
}

/** Даты считаем по местному времени: «сегодня» должно совпадать с календарём на экране */
export function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayIso(): string {
  return isoDate(new Date());
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return isoDate(new Date(y, m - 1, d + days));
}

export function mondayOf(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const shift = (date.getDay() + 6) % 7;
  return isoDate(new Date(y, m - 1, d - shift));
}

export function diffDays(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86_400_000);
}

/** Интервалы повторения в днях для ящиков 0…5 */
const INTERVALS = [0, 1, 3, 7, 16, 35];

export function nextReview(box: number, correct: boolean): { box: number; due: string } {
  const nextBox = correct ? Math.min(box + 1, INTERVALS.length - 1) : 0;
  return { box: nextBox, due: addDays(todayIso(), correct ? INTERVALS[nextBox] : 1) };
}

/** Номер недели плана на сегодня: 0 — ещё не началась, больше 24 — план закончился */
export function weekNumber(start: string | null, today: string): number | null {
  if (!start) return null;
  const days = diffDays(start, today);
  return days < 0 ? 0 : Math.floor(days / 7) + 1;
}

/** Нужно, чтобы при отрисовке на сервере не показывать данные браузера, которых там нет */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
