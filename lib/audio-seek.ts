/**
 * Перемотка плеера с любого места страницы: кнопка-таймкод отправляет
 * событие, AudioPlayer с тем же src перематывается и начинает играть.
 */
export const AUDIO_SEEK_EVENT = "audio-seek";

export type AudioSeekDetail = { src: string; at: number };

export function seekAudio(src: string, at: number) {
  window.dispatchEvent(
    new CustomEvent<AudioSeekDetail>(AUDIO_SEEK_EVENT, { detail: { src, at } }),
  );
}

export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
