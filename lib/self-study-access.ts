import type { SessionUser } from "./session";

/**
 * Личный раздел «Мой английский» (план роста преподавателя) открыт только
 * этим логинам: даже другие администраторы его не видят.
 * Модуль без серверного кода — им пользуется и шапка сайта.
 */
export const SELF_STUDY_LOGINS = ["mastertuz"];

export function canUseSelfStudy(user: Pick<SessionUser, "role" | "login">) {
  return user.role === "ADMIN" && SELF_STUDY_LOGINS.includes(user.login);
}

/**
 * Личные тесты владельца раздела: остальным не видны ни в списке, ни по ссылке,
 * в том числе другим администраторам. Тест задаётся названием.
 */
export const SELF_STUDY_TEST_TITLES = ["Тест уровня B2–C1"];
