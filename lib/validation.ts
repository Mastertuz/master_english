export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const LOGIN_RE = /^[a-zA-Z0-9_.-]+$/;
const NAME_RE = /^[a-zA-Zа-яА-ЯёЁ' -]+$/u;

export const PASSWORD_MIN_LENGTH = 6;

/**
 * Почта. С optional = true пустое поле допустимо: аккаунт ученика
 * преподаватель заводит и без адреса.
 */
export function validateEmail(
  value: string,
  { optional = false } = {},
): string | null {
  const email = value.trim();
  if (!email) return optional ? null : "Укажите почту";
  if (email.length > 190) return "Слишком длинный адрес";
  if (!EMAIL_RE.test(email)) return "Некорректный адрес почты";
  return null;
}

export function validateLogin(value: string): string | null {
  const login = value.trim();
  if (!login) return "Укажите логин";
  if (login.length < 3) return "Логин минимум 3 символа";
  if (login.length > 32) return "Логин максимум 32 символа";
  if (!LOGIN_RE.test(login))
    return "Только латиница, цифры и символы _ . -";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Укажите пароль";
  if (value.length < PASSWORD_MIN_LENGTH)
    return `Пароль минимум ${PASSWORD_MIN_LENGTH} символов`;
  if (value.length > 128) return "Пароль слишком длинный";
  return null;
}

export function validateName(
  value: string,
  label: string,
  { optional = false } = {},
): string | null {
  const name = value.trim();
  if (!name) return optional ? null : `Укажите ${label.toLowerCase()}`;
  if (name.length < 2) return `${label} минимум 2 символа`;
  if (name.length > 50) return `${label} максимум 50 символов`;
  if (!NAME_RE.test(name)) return `${label}: только буквы, дефис и апостроф`;
  return null;
}

/** Логин ИЛИ почта — поле входа */
export function validateIdentifier(value: string): string | null {
  const id = value.trim();
  if (!id) return "Укажите логин или почту";
  if (id.includes("@")) return validateEmail(id);
  return validateLogin(id);
}

export function validateResetCode(value: string): string | null {
  const code = value.trim();
  if (!code) return "Укажите код из письма";
  if (!/^\d{6}$/.test(code)) return "Код состоит из 6 цифр";
  return null;
}

/** Собирает ошибки в объект; null-значения отбрасываются */
export function collect(
  entries: Record<string, string | null>,
): FieldErrors | null {
  const errors: FieldErrors = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value) errors[key] = value;
  }
  return Object.keys(errors).length > 0 ? errors : null;
}
