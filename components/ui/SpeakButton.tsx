"use client";

import { useCallback, useEffect, useState } from "react";
import { synthesize, warmUpVoices } from "@/lib/speech";

/**
 * Проигрывает произношение. Раньше при наличии mp3 из Cambridge играла
 * запись британского диктора, а остальные слова читал синтез — голоса
 * не совпадали. Теперь всё озвучивается одним голосом (см. lib/speech).
 */
export function speak(text: string) {
  synthesize(text);
}

export function SpeakButton({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "lg";
}) {
  const [active, setActive] = useState(false);

  // Список голосов подгружается асинхронно — прогреваем его заранее
  useEffect(() => {
    warmUpVoices();
  }, []);

  const onClick = useCallback(() => {
    setActive(true);
    speak(text);
    setTimeout(() => setActive(false), 900);
  }, [text]);

  const dimensions = size === "lg" ? "h-12 w-12 text-xl" : "h-8 w-8 text-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      title="Прослушать"
      aria-label={`Прослушать «${text}»`}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink-200 bg-white transition hover:border-brand-400 hover:text-brand-600 ${dimensions} ${
        active ? "scale-95 border-brand-400 text-brand-600" : "text-ink-500"
      }`}
    >
      🔊
    </button>
  );
}
