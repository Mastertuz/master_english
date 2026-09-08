import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master English — платформа изучения английского",
  description:
    "Уроки, словарь, тренировки слов и тесты для изучения английского языка",
};

/**
 * Выбранная тема лежит в localStorage, а сервер её не знает. Читаем её
 * инлайн-скриптом в <head>: браузер выполняет его synchronously при разборе
 * HTML, то есть до первой отрисовки — тёмная тема не мигает светлой.
 * Без сохранённого выбора идём за настройкой системы.
 *
 * suppressHydrationWarning нужен потому, что скрипт меняет атрибут <html>
 * раньше, чем React сверит разметку.
 */
const applyTheme = `(function(){try{
  var t = localStorage.getItem("theme");
  if (t !== "dark" && t !== "light") {
    t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", t);
}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyTheme }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
