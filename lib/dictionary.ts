import { prisma } from "./prisma";

export type LookupResult = {
  word: string;
  russian: string;
  definition: string;
  example: string;
  transcription: string;
  partOfSpeech: string;
  audioUrl: string;
  /** cambridge | fallback — откуда взяты данные */
  source: string;
};

const CAMBRIDGE_BASE = "https://dictionary.cambridge.org/dictionary";
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

/* ───────────────────────── Вспомогательное ───────────────────────── */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&mdash;": "—",
  "&ndash;": "–",
};

function decodeEntities(input: string): string {
  return input
    .replace(/&[a-z]+;|&#\d+;/gi, (match) => {
      if (ENTITIES[match]) return ENTITIES[match];
      const numeric = /^&#(\d+);$/.exec(match);
      return numeric ? String.fromCharCode(Number(numeric[1])) : match;
    })
    .replace(/\s+/g, " ");
}

function clean(html: string | undefined): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[:;]$/, "")
    .trim();
}

function firstMatch(html: string, re: RegExp): string {
  const match = re.exec(html);
  return match ? clean(match[1]) : "";
}

export function normalizeWord(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ─────────────────────── Cambridge Dictionary ─────────────────────── */

/**
 * Парсит страницу Cambridge Dictionary.
 * Официального бесплатного API у Cambridge нет, поэтому читаем публичную
 * страницу англо-русского словаря и вынимаем нужные блоки.
 */
/** Адрес статьи: пробелы в словосочетаниях Cambridge пишет через дефис */
function cambridgeSlug(word: string): string {
  return encodeURIComponent(word.trim().toLowerCase().replace(/\s+/g, "-"));
}

/**
 * Тело первой словарной статьи. Если статьи нет (Cambridge показывает
 * страницу «возможно, вы имели в виду»), возвращаем пустую строку — иначе
 * со страницы вычитывается посторонний блок вроде «слова дня» и в базу
 * попадает транскрипция чужого слова.
 */
function firstEntry(html: string): string {
  return (
    /<div class="pr entry-body__el[\s\S]*?(?=<div class="pr entry-body__el|<\/article>|$)/.exec(
      html,
    )?.[0] ?? ""
  );
}

/**
 * IPA внутри блока произношения. Внутри <span class="ipa"> Cambridge держит
 * вложенные <span> (нередуцированные звуки), поэтому нежадный поиск до
 * первого </span> обрезает транскрипцию на середине: «kəˈnek.ʃ» вместо
 * «kəˈnek.ʃən». Разрешаем один уровень вложенности.
 */
const IPA_RE =
  /<span class="ipa dipa[^"]*"[^>]*>((?:[^<]|<span[^>]*>[^<]*<\/span>)*)<\/span>/;

/**
 * Транскрипция: сначала американская — приложение и озвучивает
 * американским голосом, — потом британская, потом любая.
 */
/** Теги внутри IPA убираем без пробела: «ʃ<span>ə</span>n» → «ʃən» */
function cleanIpa(html: string | undefined): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function extractTranscription(entry: string): string {
  if (!entry) return "";

  for (const region of ["us", "uk"]) {
    const block = new RegExp(
      `<span class="${region} dpron-i[^"]*">[\\s\\S]{0,2000}?<\\/span><\\/span>`,
    ).exec(entry)?.[0];

    const ipa = block ? cleanIpa(IPA_RE.exec(block)?.[1]) : "";
    if (ipa) return ipa;
  }

  return cleanIpa(IPA_RE.exec(entry)?.[1]);
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

/**
 * Парсит страницу Cambridge Dictionary.
 *
 * Читаем два раздела и складываем результат:
 *  · english — часть речи, транскрипция, определение, пример. Раньше первым
 *    шёл english-russian, а он переносит на начальную форму («delayed» →
 *    «delay»), из-за чего прилагательное превращалось в глагол;
 *  · english-russian — только перевод, которого в английском разделе нет.
 */
export async function fetchFromCambridge(
  word: string,
): Promise<LookupResult | null> {
  const slug = cambridgeSlug(word);

  const [englishHtml, russianHtml] = await Promise.all([
    fetchPage(`${CAMBRIDGE_BASE}/english/${slug}`),
    fetchPage(`${CAMBRIDGE_BASE}/english-russian/${slug}`),
  ]);

  const english = englishHtml ? firstEntry(englishHtml) : "";
  const russianEntry = russianHtml ? firstEntry(russianHtml) : "";

  const headword =
    firstMatch(english, /<span class="hw dhw">([\s\S]*?)<\/span>/) ||
    firstMatch(russianEntry, /<span class="hw dhw">([\s\S]*?)<\/span>/) ||
    word;

  const pick = (re: RegExp) =>
    firstMatch(english, re) || firstMatch(russianEntry, re);

  const partOfSpeech = pick(/<span class="pos dpos"[^>]*>([\s\S]*?)<\/span>/);
  const definition = pick(/<div class="def ddef_d db">([\s\S]*?)<\/div>/);
  const example = pick(/<span class="eg deg">([\s\S]*?)<\/span>/);

  const transcription =
    extractTranscription(english) || extractTranscription(russianEntry);

  const russian = firstMatch(
    russianEntry,
    /<span class="trans dtrans[^"]*"[^>]*>([\s\S]*?)<\/span>/,
  );

  const audioMatch =
    /<source[^>]+type="audio\/mpeg"[^>]+src="([^"]+)"/.exec(
      english || russianEntry,
    ) ?? /<source[^>]+src="([^"]+\.mp3)"/.exec(english || russianEntry);
  const audioUrl = audioMatch
    ? new URL(audioMatch[1], "https://dictionary.cambridge.org").toString()
    : "";

  if (!definition && !russian) return null;

  return {
    word: headword.toLowerCase(),
    russian,
    definition,
    example,
    transcription: transcription ? `/${transcription}/` : "",
    partOfSpeech,
    audioUrl,
    source: "cambridge",
  };
}

/* ──────────────────── Резервные бесплатные API ──────────────────── */

type FreeDictEntry = {
  word?: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings?: {
    partOfSpeech?: string;
    definitions?: { definition?: string; example?: string }[];
  }[];
};

async function fetchFreeDictionary(word: string) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as FreeDictEntry[];
    const entry = data?.[0];
    if (!entry) return null;

    const meaning = entry.meanings?.[0];
    const sense = meaning?.definitions?.find((d) => d.definition);
    const withExample = meaning?.definitions?.find((d) => d.example);
    const audio = entry.phonetics?.find((p) => p.audio)?.audio ?? "";
    const text = entry.phonetics?.find((p) => p.text)?.text ?? entry.phonetic;

    return {
      definition: sense?.definition ?? "",
      example: withExample?.example ?? "",
      transcription: text ?? "",
      partOfSpeech: meaning?.partOfSpeech ?? "",
      audioUrl: audio,
    };
  } catch {
    return null;
  }
}

async function translateToRussian(text: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) return "";

    const data = (await response.json()) as {
      responseData?: { translatedText?: string };
    };
    const translated = data.responseData?.translatedText ?? "";

    // MyMemory иногда возвращает служебные сообщения капслоком
    if (/^[A-Z\s'"|.\-]+$/.test(translated) && translated.length > 25) return "";
    return translated;
  } catch {
    return "";
  }
}

async function fetchFallback(word: string): Promise<LookupResult | null> {
  const [dict, russian] = await Promise.all([
    fetchFreeDictionary(word),
    translateToRussian(word),
  ]);

  if (!dict && !russian) return null;

  return {
    word,
    russian,
    definition: dict?.definition ?? "",
    example: dict?.example ?? "",
    transcription: dict?.transcription ?? "",
    partOfSpeech: dict?.partOfSpeech ?? "",
    audioUrl: dict?.audioUrl ?? "",
    source: "fallback",
  };
}

/**
 * Транскрипция словосочетания. Отдельной статьи у фраз вроде «arrival hall»
 * в Cambridge нет, поэтому собираем её из транскрипций отдельных слов:
 * «arrival» + «hall» → /əˈraɪ.v ə l hɑːl/.
 */
async function composeTranscription(phrase: string): Promise<string> {
  const parts = phrase.split(" ").filter(Boolean);
  if (parts.length < 2 || parts.length > 4) return "";

  // Только английский раздел и только транскрипция: перевод и определение
  // отдельных слов здесь не нужны, а каждая лишняя страница — секунды ожидания
  const pieces = await Promise.all(
    parts.map(async (part) => {
      const html = await fetchPage(
        `${CAMBRIDGE_BASE}/english/${cambridgeSlug(part)}`,
      );
      return html ? extractTranscription(firstEntry(html)) : "";
    }),
  );

  if (pieces.some((piece) => !piece)) return "";

  return `/${pieces.join(" ")}/`;
}

/* ─────────────────────────── Точка входа ─────────────────────────── */

/**
 * Ищет слово: сначала кэш в БД, затем Cambridge, затем резервные API.
 * Возвращает null, если ничего не нашли.
 */
export async function lookupWord(raw: string): Promise<LookupResult | null> {
  const word = normalizeWord(raw);
  if (!word || word.length > 60) return null;

  const cached = await prisma.dictionaryCache.findUnique({ where: { word } });
  if (cached) {
    return {
      word: cached.word,
      russian: cached.russian,
      definition: cached.definition,
      example: cached.example,
      transcription: cached.transcription,
      partOfSpeech: cached.partOfSpeech,
      audioUrl: cached.audioUrl,
      source: cached.source,
    };
  }

  let result = await fetchFromCambridge(word);

  // Cambridge не отдал перевод — дополняем резервным переводчиком
  if (result && !result.russian) {
    result.russian = await translateToRussian(word);
  }

  if (!result) {
    result = await fetchFallback(word);
  }

  if (!result) return null;

  // У словосочетаний своей транскрипции нет — складываем из слов
  if (!result.transcription) {
    result.transcription = await composeTranscription(word);
  }

  await prisma.dictionaryCache
    .upsert({
      where: { word },
      create: {
        word,
        russian: result.russian,
        definition: result.definition,
        example: result.example,
        transcription: result.transcription,
        partOfSpeech: result.partOfSpeech,
        audioUrl: result.audioUrl,
        source: result.source,
      },
      update: {
        russian: result.russian,
        definition: result.definition,
        example: result.example,
        transcription: result.transcription,
        partOfSpeech: result.partOfSpeech,
        audioUrl: result.audioUrl,
        source: result.source,
        fetchedAt: new Date(),
      },
    })
    .catch(() => undefined);

  return result;
}
