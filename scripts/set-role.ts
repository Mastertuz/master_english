/**
 * Смена роли аккаунта из терминала:
 *
 *   npm run role -- mastertuz            # выдать роль администратора
 *   npm run role -- mastertuz STUDENT    # вернуть роль ученика
 *   npm run role -- --list               # показать все аккаунты и их роли
 *
 * Аккаунт ищется по логину или по почте.
 */
import "dotenv/config";
import { closeDb, prisma } from "../lib/prisma";

async function list() {
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: { login: true, email: true, firstName: true, lastName: true, role: true },
  });

  if (users.length === 0) {
    console.log("В базе нет ни одного аккаунта.");
    return;
  }

  console.log("");
  for (const user of users) {
    const badge = user.role === "ADMIN" ? "АДМИНИСТРАТОР" : "ученик       ";
    console.log(`  ${badge}  ${user.login.padEnd(16)} ${user.firstName} ${user.lastName} <${user.email}>`);
  }
  console.log("");
}

async function main() {
  const target = process.argv[2];

  if (!target || target === "--list") {
    await list();
    if (!target) {
      console.log("Использование: npm run role -- <логин|почта> [ADMIN|STUDENT]");
    }
    return;
  }

  const role = (process.argv[3] ?? "ADMIN").toUpperCase();
  if (role !== "ADMIN" && role !== "STUDENT") {
    console.error(`Неизвестная роль «${role}». Допустимо: ADMIN или STUDENT.`);
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ login: target }, { email: target.toLowerCase() }] },
    select: { id: true, login: true, firstName: true, lastName: true, role: true },
  });

  if (!user) {
    console.error(`Аккаунт «${target}» не найден.`);
    await list();
    process.exit(1);
  }

  if (user.role === role) {
    console.log(`У аккаунта «${user.login}» уже роль ${role} — ничего не менял.`);
    return;
  }

  // Не даём снять роль с последнего администратора
  if (user.role === "ADMIN" && role === "STUDENT") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) {
      console.error("Это единственный администратор — роль снимать нельзя.");
      process.exit(1);
    }
  }

  await prisma.user.update({ where: { id: user.id }, data: { role } });

  console.log("");
  console.log(`✅ ${user.firstName} ${user.lastName} (${user.login}): ${user.role} → ${role}`);
  console.log("   Перезайдите в аккаунт, чтобы в шапке появился пункт «Админка».");
  console.log("");
}

main()
  .catch((error) => {
    console.error("❌ Не удалось изменить роль:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
    process.exit(0);
  });
