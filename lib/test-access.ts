import type { Prisma } from "@prisma/client";
import { canUseSelfStudy, SELF_STUDY_TEST_TITLES } from "./self-study-access";
import type { SessionUser } from "./session";

/**
 * Какие тесты доступны пользователю.
 *
 * Одно правило на список тестов и на страницу самого теста: раньше проверки
 * были разными, и тест уровня A2 показывался ученику без проставленного
 * уровня, а при открытии отдавал 404.
 *
 * Ученик видит тест, если тест выдан ему лично, относится к назначенному
 * уроку либо это свободный тест без уровня или своего уровня. Когда уровень
 * у ученика не задан, свободные тесты доступны все — фильтровать не по чему.
 */
export function testAccessWhere(user: SessionUser): Prisma.TestWhereInput {
  // Личные тесты владельца раздела «Мой английский» не видит никто другой
  if (canUseSelfStudy(user)) return {};
  const notPersonal: Prisma.TestWhereInput = {
    NOT: { title: { in: SELF_STUDY_TEST_TITLES } },
  };
  if (user.role === "ADMIN") return notPersonal;

  return {
    ...notPersonal,
    OR: [
      // выдан ученику лично
      { assignments: { some: { userId: user.id } } },
      { lesson: { assignments: { some: { userId: user.id } } } },
      {
        lessonId: null,
        ...(user.level
          ? { OR: [{ level: user.level }, { level: null }] }
          : {}),
      },
    ],
  };
}
