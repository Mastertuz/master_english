/**
 * Озвучка слов — везде одним голосом.
 *
 * Раньше часть слов проигрывалась mp3-записью из Cambridge (британский
 * диктор), а остальные синтезировались браузером — получалось два разных
 * голоса вперемешку. Теперь всё читает синтез, и голос выбирается один
 * на всё приложение: американский английский.
 */

/** Американские голоса по убыванию качества — в порядке предпочтения */
const PREFERRED = [
  // macOS / iOS
  "samantha",
  "ava",
  "allison",
  "zoe",
  "evan",
  "nicky",
  "aaron",
  // Chrome
  "google us english",
  // Windows
  "microsoft aria",
  "microsoft jenny",
  "microsoft guy",
  "microsoft zira",
  "microsoft david",
];

/**
 * Шуточные и служебные голоса macOS: формально это en-US, но читают
 * они хором, роботом или «пузырями» — для тренировки не годятся.
 */
const BAD = [
  "albert",
  "bad news",
  "bahh",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "fred",
  "good news",
  "jester",
  "junior",
  "kathy",
  "organ",
  "ralph",
  "superstar",
  "trinoids",
  "whisper",
  "wobble",
  "zarvox",
  "grandma",
  "grandpa",
];

let cached: SpeechSynthesisVoice | null = null;

/** Часть имени до скобок: «Eddy (English (United States))» → «eddy» */
function baseName(voice: SpeechSynthesisVoice): string {
  return voice.name.toLowerCase().split(" (")[0].trim();
}

/**
 * Сравниваем по началу имени, а не по вхождению подстроки: иначе
 * короткое «ava» поймает случайный «Savannah», а «fred» — «Alfredo».
 */
function named(base: string, candidate: string): boolean {
  return base === candidate || base.startsWith(`${candidate} `);
}

function score(voice: SpeechSynthesisVoice): number {
  const base = baseName(voice);
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase().replace("_", "-");

  if (BAD.some((bad) => named(base, bad))) return -1000;
  if (name.includes("compact") || name.includes("eloquence")) return -1000;

  const index = PREFERRED.findIndex((preferred) => named(base, preferred));

  // Голос из списка всегда обходит незнакомый, даже с идеальным акцентом
  let value = index >= 0 ? 1000 - index : 0;
  // Акцент важнее тембра: британский берём, только если нет ни одного US
  if (lang === "en-us") value += 200;
  if (name.includes("natural") || name.includes("neural")) value += 40;
  if (name.includes("premium") || name.includes("enhanced")) value += 30;
  if (voice.localService) value += 5;

  return value;
}

/**
 * Один и тот же голос для всех слов: американский английский,
 * лучший из доступных в системе.
 */
export function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  if (cached) return cached;

  const english = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"));

  if (english.length === 0) return null;

  // Сортировка вместо reduce — при равных баллах выбор не зависит
  // от порядка, в котором система вернула голоса
  const best = [...english].sort((a, b) => {
    const diff = score(b) - score(a);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  })[0];

  cached = best;
  return best;
}

/** Синтез речи выбранным голосом, в спокойном темпе */
export function synthesize(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  // Язык задаём всегда: если подходящего голоса нет, движок хотя бы
  // прочитает по-американски, а не голосом системной локали
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.02;

  window.speechSynthesis.speak(utterance);
}

/**
 * Голоса подгружаются асинхронно — сбрасываем кэш, когда список
 * появится, чтобы первый выбор не остался на голосе-заглушке.
 */
export function warmUpVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const refresh = () => {
    cached = null;
    pickVoice();
  };

  refresh();
  window.speechSynthesis.addEventListener("voiceschanged", refresh, {
    once: true,
  });
}
