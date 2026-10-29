"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { addDeckWordsAction } from "@/app/actions/decks";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { partOfSpeechRu } from "@/lib/part-of-speech";
import { deckWordKey, type Deck } from "@/lib/word-decks";

/** Страница набора: список слов, выбор нужных и добавление в личный словарь */
export function DeckView({ deck, added }: { deck: Deck; added: string[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const have = useMemo(() => new Set(added), [added]);
  const fresh = deck.items.filter((item) => !have.has(deckWordKey(item.english)));
  const needle = query.trim().toLowerCase();
  const visible = deck.items.filter(
    (item) => !needle || item.english.toLowerCase().includes(needle) || item.russian.toLowerCase().includes(needle),
  );
  const addedCount = deck.items.length - fresh.length;

  function toggle(key: string) {
    setSelected((old) => {
      const next = new Set(old);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function add(only?: string[]) {
    startTransition(async () => {
      const result = await addDeckWordsAction(deck.id, only);
      setMessage(result.message);
      if (result.ok) {
        setSelected(new Set());
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dictionary/decks" className="text-[13.5px] text-ink-500 hover:text-ink-800">
          ← Все наборы
        </Link>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="chip bg-brand-50 text-brand-700">{deck.level}</span>
          <span className="chip bg-ink-100 text-ink-600">{deck.items.length} слов</span>
        </div>
        <h1 className="page-title mt-2">
          <span aria-hidden>{deck.icon}</span> {deck.title}
        </h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">{deck.description}</p>
      </div>

      <div className="card space-y-3 p-5">
        <p className="text-[14.5px] text-ink-700">
          В вашем словаре: <b className="text-ink-900">{addedCount}</b> из {deck.items.length}.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={pending || fresh.length === 0} onClick={() => add()} className="btn-primary">
            {pending ? "Добавляем…" : fresh.length === 0 ? "Весь набор уже в словаре" : `＋ Добавить весь набор (${fresh.length})`}
          </button>
          <button
            type="button"
            disabled={pending || selected.size === 0}
            onClick={() => add([...selected])}
            className="btn-ghost"
          >
            Добавить выбранные ({selected.size})
          </button>
          {addedCount > 0 ? (
            <>
              <Link href={`/training/translate?deck=${deck.id}`} className="btn-ghost">
                🎯 Тренировать: слово и перевод
              </Link>
              <Link href={`/training/definition?deck=${deck.id}`} className="btn-ghost">
                💡 Слово по определению
              </Link>
            </>
          ) : null}
        </div>
        {message ? <p className="text-[13.5px] text-emerald-700">{message}</p> : null}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по слову или переводу…"
          autoComplete="off"
          className="field"
        />
      </div>

      <ul className="card divide-y divide-ink-100 p-0">
        {visible.map((item) => {
          const key = deckWordKey(item.english);
          const isAdded = have.has(key);
          return (
            <li key={item.english} className="flex items-start gap-3 px-4 py-3">
              {isAdded ? (
                <span className="mt-1 h-4 w-4 shrink-0 text-center text-[13px] text-emerald-600" title="Уже в словаре">
                  ✓
                </span>
              ) : (
                <input
                  type="checkbox"
                  checked={selected.has(key)}
                  onChange={() => toggle(key)}
                  aria-label={`Выбрать «${item.english}»`}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                />
              )}
              <SpeakButton text={item.english.replace(/…/g, "").trim()} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-ink-900">
                  {item.english}
                  {item.partOfSpeech ? (
                    <span className="ml-2 rounded bg-ink-100 px-1.5 py-0.5 text-[11.5px] font-normal text-ink-500">{partOfSpeechRu(item.partOfSpeech)}</span>
                  ) : null}
                </p>
                <p className="text-[14px] text-ink-600">{item.russian}</p>
                {item.example ? <p className="text-[13.5px] italic text-ink-500">{item.example}</p> : null}
              </div>
            </li>
          );
        })}
        {visible.length === 0 ? <li className="px-4 py-6 text-center text-[14px] text-ink-500">Ничего не найдено</li> : null}
      </ul>
    </div>
  );
}
