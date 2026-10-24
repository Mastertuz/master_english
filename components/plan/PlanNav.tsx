"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/plan/today", label: "Сегодня", icon: "☀️" },
  { href: "/plan", label: "План", icon: "🗺", exact: true },
  { href: "/plan/speaking", label: "Говорение", icon: "🎙" },
  { href: "/plan/grammar", label: "Грамматика", icon: "🧩" },
  { href: "/plan/units", label: "Empower C1", icon: "📘" },
  { href: "/plan/vocab", label: "Слова", icon: "🗂" },
  { href: "/plan/writing", label: "Письмо", icon: "✍️" },
  { href: "/plan/errors", label: "Ошибки", icon: "🎯" },
];

/** Подразделы «Мой английский»: одна полоса на всех страницах плана */
export function PlanNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Мой английский"
      className="-mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1"
    >
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[14px] font-medium transition ${
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
