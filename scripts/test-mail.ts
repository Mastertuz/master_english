/**
 * Проверка настроек почты: npm run mail:test
 *
 * Отправляет тестовое письмо на адрес из SMTP_USER. Если SMTP не настроен,
 * письмо просто печатается в консоль — так же, как в приложении.
 */
import "dotenv/config";
import { resetCodeEmail, sendMail } from "../lib/mail";

async function main() {
  // Игнорируем мусор из командной строки (например, хвост "# комментарий"),
  // адресом считаем только аргумент, похожий на email.
  const arg = process.argv[2];
  const to = arg && arg.includes("@") ? arg : process.env.SMTP_USER;

  if (!to) {
    console.error("Укажите адрес: npm run mail:test -- you@example.com");
    process.exit(1);
  }

  console.log(`Хост:     ${process.env.SMTP_HOST ?? "(не задан — вывод в консоль)"}`);
  console.log(`Порт:     ${process.env.SMTP_PORT ?? "587"}`);
  console.log(`Отправка: ${to}`);
  console.log("");

  const mail = resetCodeEmail("123456", "Тест");
  await sendMail({ ...mail, to });

  console.log("✅ Готово. Если SMTP настроен — проверьте почту (в том числе «Спам»).");
}

main().catch((error) => {
  console.error("❌ Не удалось отправить письмо:");
  console.error(error);
  process.exit(1);
});
