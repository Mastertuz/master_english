import { fetchFromCambridge, normalizeWord } from "@/lib/dictionary";
import { prisma } from "@/lib/prisma";
import type { WordCard } from "./vocab-defs";

/**
 * Слово для поиска в Cambridge: убираем «…», артикль, «to» и подлежащее в начале,
 * из «A / B» берём первое. Длинные обороты в словаре не ищутся: их там нет.
 */
export function lookupTerm(english: string): string | null {
  let term = english.split("/")[0].replace(/[…?]/g, " ").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  for (let i = 0; i < 3; i += 1) {
    term = term.replace(/^(to|a|an|the|i|you|he|she|it|we|they|someone|something)\s+/i, "");
  }
  term = term.replace(/\s+(someone|something|sb|sth|doing something)$/i, "").trim();
  const words = term.split(" ").filter(Boolean);
  if (words.length === 0 || words.length > 4) return null;
  return term.toLowerCase();
}

export type Enriched = { definition: string; transcription: string; partOfSpeech: string; audioUrl: string; example: string };

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

function plain(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/[:;]\s*$/, "")
    .trim();
}

/**
 * Фразовые глаголы и идиомы лежат на страницах Cambridge в другой разметке, чем обычные
 * слова, и общий разбор их пропускает. Достаём первое определение и пример напрямую.
 */
async function fromPhrasePage(word: string): Promise<Enriched | null> {
  try {
    const slug = encodeURIComponent(word.replace(/\s+/g, "-"));
    const response = await fetch(`https://dictionary.cambridge.org/dictionary/english/${slug}`, {
      headers: HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const definition = plain(/<div class="def ddef_d db">([\s\S]*?)<\/div>/.exec(html)?.[1]);
    if (!definition) return null;
    const example = plain(/<span class="eg deg">([\s\S]*?)<\/span>/.exec(html)?.[1]);
    return { definition, example, transcription: "", partOfSpeech: "", audioUrl: "" };
  } catch {
    return null;
  }
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Определение и произношение из Cambridge для слов, у которых своего определения нет.
 * Общий поиск по словарю сохраняет в кэш и неудачи (резервный перевод без определения),
 * после чего слово больше не ищется в Cambridge. Здесь кэш с определением используется,
 * а пустые записи не считаются ответом: слово запрашивается заново.
 */
export async function enrichFromCambridge(card: WordCard): Promise<Enriched | null> {
  const term = lookupTerm(card.en);
  if (!term) return null;
  const word = normalizeWord(term);

  try {
    const cached = await prisma.dictionaryCache.findUnique({ where: { word } });
    if (cached && cached.source === "cambridge" && cached.definition) {
      return {
        definition: cached.definition,
        transcription: cached.transcription,
        partOfSpeech: cached.partOfSpeech,
        audioUrl: cached.audioUrl,
        example: cached.example,
      };
    }

    // Cambridge иногда отвечает отказом при частых запросах: одна повторная попытка
    let found = await fetchFromCambridge(word);
    if (!found?.definition) {
      await pause(1500);
      found = await fetchFromCambridge(word);
    }
    if (!found?.definition) {
      const phrase = await fromPhrasePage(word);
      if (!phrase) return null;
      await prisma.dictionaryCache.upsert({
        where: { word },
        create: { word, russian: "", source: "cambridge", ...phrase },
        update: { source: "cambridge", ...phrase, fetchedAt: new Date() },
      });
      return phrase;
    }

    const data = {
      russian: found.russian,
      definition: found.definition,
      example: found.example,
      transcription: found.transcription,
      partOfSpeech: found.partOfSpeech,
      audioUrl: found.audioUrl,
      source: "cambridge",
    };
    await prisma.dictionaryCache.upsert({ where: { word }, create: { word, ...data }, update: { ...data, fetchedAt: new Date() } });
    return data;
  } catch {
    return null;
  }
}
