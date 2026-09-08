import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Папку сборки можно увести в сторону переменной окружения: рядом с
   * запущенным `next dev` прод-сборка иначе перезаписывает его манифесты,
   * и страницы перестают оживать в браузере.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
