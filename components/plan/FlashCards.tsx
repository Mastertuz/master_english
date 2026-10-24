"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { buildDeck, type DeckCard } from "@/lib/study/deck";
import { WEEKS } from "@/lib/study/schedule";
import { nextReview, todayIso, useStudy, weekNumber } from "./study-store";

const NEW_PER_SESSION = 10;

function Session({ queue, onClose }: { queue: DeckCard[]; onClose: () => void }) {
  const [state, update] = useStudy();
  const [cards] = useState(queue);
  // Ящики на начало сессии: ориентацию карточки не меняем, пока её показывают
  const [boxes] = useState(() => Object.fromEntries(queue.map((item) => [item.id, state.cards[item.id]?.box ?? 0])));
  const [position, setPosition] = useState(0);
  const [again, setAgain] = useState<DeckCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);

  const all = [...cards, ...again];
  const card = all[position];

  if (!card) {
    return (
      <section className="card space-y-3 p-6 text-center">
        <p className="text-[20px] font-semibold text-ink-900">
          Сессия окончена: вспомнили {right} из {cards.length}
        </p>
        <p className="text-[14px] text-ink-500">Карточки, которые вы не вспомнили, вернутся завтра.</p>
        <button type="button" onClick={onClose} className="btn-primary">
          Готово
        </button>
      </section>
    );
  }

  // Карточки с высоким ящиком спрашиваем с русского: надо вспомнить английское
  const reverse = position < cards.length && (boxes[card.id] ?? 0) >= 2;

  function grade(ok: boolean) {
    update((old) => {
      const current = old.cards[card.id] ?? { box: 0, due: todayIso(), seen: 0 };
      const next = nextReview(current.box, ok);
      return { ...old, cards: { ...old.cards, [card.id]: { ...next, seen: current.seen + 1 } } };
    });
    if (ok) setRight((count) => count + 1);
    else setAgain((list) => (list.some((item) => item.id === card.id) ? list : [...list, card]));
    setRevealed(false);
    setPosition((value) => value + 1);
  }

  return (
    <section className="space-y-4">
      <p className="text-[13px] text-ink-500">
        Карточка {position + 1} из {all.length} · юнит {card.unit}
      </p>
      <div className="card space-y-4 p-8 text-center">
        <p className="text-[12.5px] uppercase tracking-wide text-ink-400">{reverse ? "Как это по-английски?" : "Что это значит?"}</p>
        <p className="text-[28px] font-semibold leading-snug text-ink-900">{reverse ? card.ru : card.en}</p>
        {!reverse ? (
          <div className="flex justify-center">
            <SpeakButton text={card.en.replace(/…/g, "").replace(/\s*\/\s*/g, ", ")} />
          </div>
        ) : null}
        {revealed ? (
          <div className="space-y-2 border-t border-ink-100 pt-4">
            <p className="text-[22px] font-medium text-brand-700">{reverse ? card.en : card.ru}</p>
            {card.example ? <p className="text-[15px] italic text-ink-600">{card.example}</p> : null}
            {reverse ? (
              <div className="flex justify-center">
                <SpeakButton text={card.en.replace(/…/g, "").replace(/\s*\/\s*/g, ", ")} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => grade(false)} className="btn-ghost">
            Не вспомнил(а)
          </button>
          <button type="button" onClick={() => grade(true)} className="btn-primary">
            Вспомнил(а)
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setRevealed(true)} className="btn-primary w-full">
          Показать ответ
        </button>
      )}
    </section>
  );
}

export function FlashCards() {
  const [state] = useStudy();
  const [session, setSession] = useState<DeckCard[] | null>(null);
  const [all, setAll] = useState(false);

  const deck = useMemo(() => buildDeck(), []);
  const today = todayIso();
  const week = weekNumber(state.startDate, today);
  const currentUnit = week && week >= 1 ? (WEEKS[Math.min(week, WEEKS.length) - 1].unit ?? (week > 21 ? 10 : 1)) : 1;
  const maxUnit = all ? 10 : Math.max(currentUnit, 1);

  const open = deck.filter((card) => card.unit <= maxUnit);
  const fresh = open.filter((card) => !state.cards[card.id]);
  const due = open.filter((card) => {
    const item = state.cards[card.id];
    return item && item.due <= today && item.box < 5;
  });
  const learned = deck.filter((card) => (state.cards[card.id]?.box ?? 0) >= 5).length;
  const learning = deck.filter((card) => state.cards[card.id] && (state.cards[card.id]?.box ?? 0) < 5).length;

  function start() {
    setSession([...due.slice(0, 30), ...fresh.slice(0, NEW_PER_SESSION)]);
  }

  if (session) {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Слова и фразы</h1>
        <Session queue={session} onClose={() => setSession(null)} />
      </div>
    );
  }

  const queueSize = Math.min(due.length, 30) + Math.min(fresh.length, NEW_PER_SESSION);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Слова и фразы</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Карточки с интервальным повторением: слова юнитов Empower C1 и фразы из записей. Каждый день по 10 новых и повторение тех, что пора. Нажимайте
          «Вспомнил(а)» только если действительно вспомнили без подсказки: так интервал растёт честно.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">Новые (открыты)</p>
          <p className="mt-1 text-[28px] font-semibold text-ink-900">{fresh.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">Повторить сегодня</p>
          <p className="mt-1 text-[28px] font-semibold text-brand-700">{due.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">В обучении</p>
          <p className="mt-1 text-[28px] font-semibold text-ink-900">{learning}</p>
        </div>
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">Выучено</p>
          <p className="mt-1 text-[28px] font-semibold text-emerald-700">{learned}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={start} disabled={queueSize === 0} className="btn-primary">
          ▶ Начать ({queueSize})
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-[14px] text-ink-700">
          <input type="checkbox" checked={all} onChange={(event) => setAll(event.target.checked)} className="h-4 w-4 accent-brand-600" />
          Открыть слова всех юнитов (сейчас: до юнита {maxUnit})
        </label>
      </div>

      <p className="text-[13.5px] text-ink-500">
        Слова юнитов открываются по мере того, как вы доходите до них в плане. Всего в колоде {deck.length} карточек. Слова можно также{" "}
        <Link href="/dictionary" className="text-brand-700 hover:underline">
          добавлять в общий словарь
        </Link>{" "}
        выделением в любом тексте.
      </p>
    </div>
  );
}
