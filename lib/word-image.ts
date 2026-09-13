/**
 * Автоматическая картинка для слова — только если её можно нарисовать.
 * «pond» — фото пруда помогает запомнить слово, а у «amplify» или
 * «compassion» любая картинка сбивала бы с толку в тренировке «что изображено?».
 */

type WordInfo = { english: string; partOfSpeech: string; definition: string };

const USER_AGENT = "MasterEnglish/1.0 (educational English dictionary)";
const TIMEOUT_MS = 6000;

// Определения отвлечённых понятий: чувство, качество, событие, правило…
const ABSTRACT_DEFINITION =
  /^(\(?an?\)?\s+|the\s+)?(\(a way of\)|feeling|quality|fact|state|act\b|action|ability|condition|behaviou?r|way\b|amount|time|process|idea|situation|event|experience|arrangement|reduction|payment|rules?\b|part of|series|examination|period|belief|sense|chance|change|problem|reason|result|decision|agreement|relationship|method|system|information|knowledge|attitude|opinion|lack|level|number|word|phrase|name|type|kind|sort|group of ideas|visiting|when\b|how\b|if\b|someone's|something that (happens|you do|you learn))/i;

// Отвлечённое слово в самом определении: «polite behaviour», «extreme surprise»
const ABSTRACT_HEAD =
  /\b(behaviou?r|surprise|happiness|luck|feeling|emotion|quality|experience|condition|situation|service|attitude|sympathy|respect|danger|harm|help)\b/i;

// Суффиксы отвлечённых существительных: vanity, astonishment, salvation…
const ABSTRACT_SUFFIX = /(ity|ness|ment|ance|ence|tion|sion|ship|dom|ism|ry|cy|ure|hood)$/i;

// «something that you agree to do» — отвлечённо, «something you buy» — вещь
const SOMETHING = /^something\b/i;
const SOMETHING_OBJECT = /^something (that )?(you|people) (buy|wear|eat|drink|carry|use)\b/i;

// Люди подходят, только если у них узнаваемая работа: кассир, флорист
const PERSON_DEFINITION = /^(someone|somebody|a person|people)\b/i;
const VISUAL_PERSON = /\b(job|sells?|works? (in|at|on)|employee|wears?)\b/i;

/** Можно ли показать слово на фото — конкретное существительное */
export function isPicturable({ english, partOfSpeech, definition }: WordInfo): boolean {
  const pos = partOfSpeech.toLowerCase();
  if (!/\bnoun\b/.test(pos) || /\b(verb|adjective|adverb|phrase)\b/.test(pos)) return false;

  const words = english.trim().split(/\s+/);
  if (words.length > 3) return false;
  if (words.length === 1 && ABSTRACT_SUFFIX.test(words[0])) return false;

  const text = definition.split(";")[0].trim();
  if (!text) return false;
  if (ABSTRACT_DEFINITION.test(text)) return false;
  if (SOMETHING.test(text)) return SOMETHING_OBJECT.test(text);
  if (PERSON_DEFINITION.test(text)) return VISUAL_PERSON.test(text);
  // Главное слово определения — до первого «that/which/who/where/in/of»
  const head = text.split(/\b(that|which|who|whose|where|when|in|of|for|to|from)\b/i)[0];
  return !ABSTRACT_HEAD.test(head);
}

async function getJson(url: string, retries = 2): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // Wikipedia ограничивает частые запросы — немного ждём и пробуем снова
  if (response.status === 429 && retries > 0) {
    const wait = Math.min(Number(response.headers.get("retry-after")) || 2, 5);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    return getJson(url, retries - 1);
  }
  if (!response.ok) return null;
  return response.json();
}

const isPhoto = (url: string) => /\.(jpe?g|webp)(\/|\?|$)/i.test(url);

/** Главная фотография статьи Wikipedia — обычно она точнее всего */
async function fromWikipedia(english: string): Promise<string | null> {
  const title = english.trim().replace(/\s+/g, "_");
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    redirects: "1",
    prop: "pageimages|pageprops",
    piprop: "thumbnail",
    pithumbsize: "640",
    titles: title.charAt(0).toUpperCase() + title.slice(1),
  });
  const data = (await getJson(`https://en.wikipedia.org/w/api.php?${params}`)) as {
    query?: {
      pages?: Record<string, { title: string; missing?: string; pageprops?: Record<string, string>; thumbnail?: { source: string } }>;
    };
  } | null;

  const page = Object.values(data?.query?.pages ?? {})[0];
  if (!page || "missing" in page) return null;
  // Перенаправление могло увести к другому понятию: «aisle seat» → «Aisle»
  if (!mentionsAll(page.title, english)) return null;
  // Страница-развилка («plane» — самолёт, плоскость, рубанок) не подходит
  if (page.pageprops && "disambiguation" in page.pageprops) return null;

  const source = page.thumbnail?.source;
  // Схемы, логотипы и флаги в SVG/PNG — не фото предмета
  return source && isPhoto(source) ? source.replace(/\?.*$/, "") : null;
}

/** Запасной вариант — фото в общественном достоянии с Openverse */
async function fromOpenverse(english: string): Promise<string | null> {
  const params = new URLSearchParams({
    q: english,
    license: "cc0,pdm",
    page_size: "10",
    mature: "false",
  });
  const data = (await getJson(`https://api.openverse.org/v1/images/?${params}`)) as {
    results?: { title?: string; url?: string; width?: number; height?: number }[];
  } | null;

  // Поиск ищет и по тегам, поэтому «pond, damselfly nymph» тоже находится.
  // Берём только фото, чьё короткое название — само слово: «Icicles»
  const match = data?.results?.find((item) => {
    const title = words(item.title ?? "");
    return (
      item.url?.startsWith("https://") &&
      isPhoto(item.url) &&
      (item.width ?? 0) >= 400 &&
      title.length <= words(english).length + 2 &&
      mentionsAll(item.title ?? "", english)
    );
  });
  return match?.url ?? null;
}

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+/g) ?? [];
}

/** Все слова запроса есть в названии, с поправкой на окончание: suitcase → suitcases */
function mentionsAll(title: string, english: string): boolean {
  const have = words(title);
  return words(english).every((word) => {
    const stem = word.replace(/(es|s)$/, "");
    return have.some((item) => item.startsWith(stem));
  });
}

/** Ссылка на фото для слова или null, если фото слову не подходит */
export async function findWordImage(word: WordInfo): Promise<string | null> {
  if (!isPicturable(word)) return null;
  try {
    return (await fromWikipedia(word.english)) ?? (await fromOpenverse(word.english));
  } catch {
    return null;
  }
}
