"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { SessionUser } from "@/lib/session";

const NAV = [
  { href: "/dashboard", label: "Главная", icon: "🏠" },
  { href: "/lessons", label: "Уроки", icon: "📚" },
  { href: "/homework", label: "Домашние задания", icon: "✍️" },
  { href: "/dictionary", label: "Словарь", icon: "🗂" },
  { href: "/training", label: "Тренировка", icon: "🎯" },
  { href: "/tests", label: "Тесты", icon: "📝" },
];

const ADMIN_NAV = [
  { href: "/students", label: "Ученики", icon: "🎓" },
  { href: "/admin", label: "Админка", icon: "🛠" },
];

function initialsOf(user: { firstName: string; lastName: string }) {
  return `${user.firstName.trim().charAt(0)}${user.lastName.trim().charAt(0)}`.toUpperCase();
}

export function Header({
  user,
  newComments = 0,
}: {
  user: SessionUser;
  /** Сколько новых комментариев преподавателя ждёт ученика */
  newComments?: number;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = user.role === "ADMIN" ? [...NAV, ...ADMIN_NAV] : NAV;

  // Любой переход закрывает и меню, и боковую панель.
  // Сброс делаем на рендере, а не в эффекте — иначе панель успевает
  // мигнуть на новой странице.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setMenuOpen(false);
  }

  // Клик вне меню профиля и Escape закрывают его
  useEffect(() => {
    if (!menuOpen && !drawerOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, drawerOpen]);

  // Пока открыта боковая панель, страница под ней не скроллится
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={drawerOpen}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition hover:bg-ink-50 lg:hidden"
          >
            <span className="relative block h-[14px] w-[18px]">
              <span className="absolute inset-x-0 top-0 h-0.5 rounded bg-current" />
              <span className="absolute inset-x-0 top-1.5 h-0.5 rounded bg-current" />
              <span className="absolute inset-x-0 top-3 h-0.5 rounded bg-current" />
              {newComments > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              ) : null}
            </span>
          </button>

          <Link
            href="/dashboard"
            prefetch
            className="shrink-0 text-[17px] font-semibold tracking-tight text-ink-900"
          >
            Master<span className="text-brand-600">English</span>
          </Link>

          <nav className="hidden flex-1 items-center gap-0.5 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium transition ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
                {item.href === "/dashboard" && newComments > 0 ? (
                  <Badge count={newComments} />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <ThemeToggle className="h-10 w-10 rounded-xl border border-ink-200 text-[17px] hover:bg-ink-50" />
          </div>

          <div className="shrink-0" ref={menuRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={`${user.firstName} ${user.lastName}`}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-[14px] font-semibold text-white transition hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand-500/25"
              >
                {initialsOf(user)}
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-[14px] font-semibold text-ink-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-[12.5px] text-ink-500">
                      {user.email}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span
                        className={`chip ${
                          user.role === "ADMIN"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-brand-50 text-brand-700"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Администратор" : "Ученик"}
                      </span>
                      {user.level ? (
                        <span className="chip bg-emerald-50 text-emerald-700">
                          {user.level}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="my-1 h-px bg-ink-200" />

                  <Link
                    href="/profile"
                    prefetch
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-ink-700 transition hover:bg-ink-100"
                  >
                    <span aria-hidden>👤</span> Профиль
                  </Link>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] text-rose-600 transition hover:bg-rose-50"
                    >
                      <span aria-hidden>🚪</span> Выйти
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Боковое меню для мобильных */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 overlay transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-200 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-ink-200 px-4">
            <span className="text-[17px] font-semibold tracking-tight text-ink-900">
              Master<span className="text-brand-600">English</span>
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Закрыть меню"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
                {item.href === "/dashboard" && newComments > 0 ? (
                  <Badge count={newComments} />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-ink-200 p-3">
            <ThemeToggle
              label
              className="mb-1 w-full justify-start gap-3 rounded-xl px-3 py-3 text-[15px] text-ink-700 hover:bg-ink-100"
            />
            <Link
              href="/profile"
              prefetch
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-ink-700 transition hover:bg-ink-100"
            >
              <span className="text-lg" aria-hidden>
                👤
              </span>
              Профиль
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] text-rose-600 transition hover:bg-rose-50"
              >
                <span className="text-lg" aria-hidden>
                  🚪
                </span>
                Выйти
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}

/** Число новых комментариев рядом с пунктом меню */
function Badge({ count }: { count: number }) {
  return (
    <span className="ml-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
