/**
 * Отправка писем.
 *
 * Если в .env заданы SMTP_HOST / SMTP_USER / SMTP_PASSWORD — письмо уходит
 * через nodemailer. Если нет (или пакет не установлен) — письмо печатается
 * в консоль сервера, чтобы можно было тестировать восстановление пароля
 * без настроенной почты.
 */

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let transporterPromise: Promise<unknown> | null = null;

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

async function getTransporter() {
  if (!smtpConfigured()) return null;

  if (!transporterPromise) {
    transporterPromise = (async () => {
      try {
        const imported = await import("nodemailer");
        const nodemailer = (imported.default ?? imported) as {
          createTransport: (options: unknown) => unknown;
        };
        const port = Number(process.env.SMTP_PORT ?? 587);
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port,
          secure: port === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } catch {
        console.warn(
          "[mail] Пакет nodemailer не установлен — письма пишутся в консоль. " +
            "Установите его командой: npm install nodemailer",
        );
        return null;
      }
    })();
  }

  return transporterPromise;
}

export async function sendMail(payload: MailPayload): Promise<void> {
  const transporter = (await getTransporter()) as
    | { sendMail: (options: Record<string, unknown>) => Promise<unknown> }
    | null;

  if (!transporter) {
    console.info(
      [
        "",
        "──────── ПИСЬМО (SMTP не настроен) ────────",
        `Кому:  ${payload.to}`,
        `Тема:  ${payload.subject}`,
        "",
        payload.text,
        "───────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export function resetCodeEmail(code: string, name: string): MailPayload {
  const text = [
    `Здравствуйте, ${name}!`,
    "",
    `Код для восстановления пароля в Master English: ${code}`,
    "",
    "Код действует 15 минут. Если вы не запрашивали смену пароля — просто",
    "проигнорируйте это письмо.",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0f172a">Master English</h2>
      <p style="color:#475569;margin:0 0 24px">Здравствуйте, ${name}!</p>
      <p style="color:#475569;margin:0 0 8px">Код для восстановления пароля:</p>
      <div style="font-size:32px;letter-spacing:8px;font-weight:700;color:#0f172a;background:#f1f5f9;padding:16px;border-radius:12px;text-align:center">${code}</div>
      <p style="color:#94a3b8;font-size:13px;margin:24px 0 0">
        Код действует 15 минут. Если вы не запрашивали смену пароля — проигнорируйте письмо.
      </p>
    </div>`;

  return {
    to: "",
    subject: "Код восстановления пароля — Master English",
    text,
    html,
  };
}

/** Адрес приложения для ссылок в письмах */
export function appUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Письмо ученику о новом комментарии преподавателя */
export function newCommentEmail(input: {
  name: string;
  where: string;
  task: string;
  comment: string;
  href: string;
}): MailPayload {
  const link = `${appUrl()}${input.href}`;

  const text = [
    `Здравствуйте, ${input.name}!`,
    "",
    "Преподаватель оставил комментарий к вашей работе.",
    "",
    `${input.where}`,
    `Задание: ${input.task}`,
    "",
    `«${input.comment}»`,
    "",
    `Открыть: ${link}`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0f172a">Master English</h2>
      <p style="color:#475569;margin:0 0 20px">Здравствуйте, ${input.name}!</p>
      <p style="color:#475569;margin:0 0 12px">Преподаватель оставил комментарий к вашей работе.</p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:0 0 20px">
        <p style="margin:0 0 4px;color:#94a3b8;font-size:13px">${input.where}</p>
        <p style="margin:0 0 8px;color:#475569;font-size:14px">${input.task}</p>
        <p style="margin:0;color:#0f172a;font-size:15px">${input.comment}</p>
      </div>
      <a href="${link}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">Посмотреть в уроке</a>
    </div>`;

  return {
    to: "",
    subject: "Новый комментарий преподавателя — Master English",
    text,
    html,
  };
}
