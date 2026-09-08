import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * В Next.js 16 middleware переименован в proxy.
 * Здесь только быстрая оптимистичная проверка куки — настоящая авторизация
 * (запрос в БД) происходит в серверных компонентах и серверных экшенах.
 */

const SESSION_COOKIE = "me_session";

// Маршруты, доступные без авторизации
const PUBLIC_PATHS = ["/", "/forgot", "/reset"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Обратный редирект (/ → /dashboard) делает сама страница входа: там
  // сессия проверяется по базе, а не по одному лишь наличию куки.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
