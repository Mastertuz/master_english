import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { DECKS, DECK_GROUPS, deckWordKey } from "@/lib/word-decks";
import { wordsLabel } from "@/lib/word-decks/key";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
/** Уровни, для которых есть наборы */
const FILTERS = ["A1", "A2", "B1", "B2", "C1"];

/** «A2–B1» подходит ученику уровня A2 или B1, а также тем, кто ровно между ними */
function suits(level: string, userLevel: string | null): boolean {
  if (!userLevel) return false;
  const [from, to] = level.split("–");
  const index = LEVELS.indexOf(userLevel);
  return index >= LEVELS.indexOf(from) && index <= LEVELS.indexOf(to ?? from);
}

export default async function DecksPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const level = params.level && FILTERS.includes(params.level) ? params.level : null;
  const words = await prisma.word.findMany({ where: { userId: user.id }, select: { english: true } });
  const have = new Set(words.map((word) => word.english));

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dictionary" className="text-[13.5px] text-ink-500 hover:text-ink-800">
          ← Словарь
        </Link>
        <h1 className="page-title mt-1">Готовые наборы слов</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Как общие колоды в Anki: самые частотные слова, фразы и слова по темам. Откройте набор и добавьте его в свой словарь целиком или выберите нужное.
          Потом слова тренируются в обычных режимах: перевод, определение. Всего {DECKS.length} наборов и около{" "}
          {new Set(DECKS.flatMap((deck) => deck.items.map((item) => deckWordKey(item.english)))).size} слов и фраз.
        </p>
      </div>

      <nav aria-label="Уровень" className="flex flex-wrap items-center gap-1.5">
        {[null, ...FILTERS].map((item) => (
          <Link
            key={item ?? "all"}
            href={item ? `/dictionary/decks?level=${item}` : "/dictionary/decks"}
            scroll={false}
            aria-current={item === level ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-[13.5px] transition ${
              item === level
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-700 hover:border-brand-300"
            }`}
          >
            {item ?? "Все уровни"}
          </Link>
        ))}
      </nav>

      {DECK_GROUPS.map((group) => {
        const decks = DECKS.filter((deck) => deck.group === group.id && (!level || suits(deck.level, level)));
        if (decks.length === 0) return null;
        return (
          <section key={group.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">{group.title}</h2>
              <p className="text-[14px] text-ink-600">{group.text}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => {
                const added = deck.items.filter((item) => have.has(deckWordKey(item.english))).length;
                const percent = Math.round((added / deck.items.length) * 100);
                const fit = suits(deck.level, user.level);
                return (
                  <Link
                    key={deck.id}
                    href={`/dictionary/decks/${deck.id}`}
                    prefetch
                    className={`card flex flex-col p-4 transition hover:border-brand-300 ${fit ? "border-brand-400" : ""}`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="chip bg-brand-50 text-brand-700">{deck.level}</span>
                      <span className="chip bg-ink-100 text-ink-600">{wordsLabel(deck.items.length)}</span>
                      {fit ? <span className="chip bg-emerald-50 text-emerald-700">для вашего уровня</span> : null}
                    </div>
                    <p className="mt-2 text-[15.5px] font-semibold leading-snug text-ink-900">
                      <span aria-hidden>{deck.icon}</span> {deck.title}
                    </p>
                    <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-ink-600">{deck.description}</p>
                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div className={`h-full rounded-full ${percent === 100 ? "bg-emerald-500" : "bg-brand-600"}`} style={{ width: `${percent}%` }} />
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink-500">
                        {added === 0 ? "Ещё не добавлен" : `В вашем словаре: ${added} из ${deck.items.length}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
