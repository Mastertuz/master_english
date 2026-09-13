import {
  affixes,
  homelandIdeas,
  letterPhrases,
  linkingWords,
  monologueBank,
  monologueInstruction,
  trapWords,
  vocabularyTopics,
  type Phrase,
} from "@/lib/oge/materials";

function PhraseList({ phrases }: { phrases: Phrase[] }) {
  return (
    <ul className="space-y-0.5">
      {phrases.map((phrase) => (
        <li key={phrase.en} className="break-words">
          <span className="font-medium text-ink-900">{phrase.en}</span>
          <span className="text-ink-500"> — {phrase.ru}</span>
        </li>
      ))}
    </ul>
  );
}

/** Задание 35: фразы для каждой части письма и слова-связки */
export function LetterPhrasesView() {
  return (
    <details className="rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-3">
      <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
        Фразы для каждой части письма и слова-связки
      </summary>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed">
        {letterPhrases.map((block, index) => (
          <div key={block.part} className="rounded-lg bg-white/70 px-3 py-2">
            <p className="font-semibold text-ink-900">
              {index + 1}. {block.part}
            </p>
            <p className="text-[13px] text-ink-500">{block.note}</p>
            <div className="mt-1">
              <PhraseList phrases={block.phrases} />
            </div>
          </div>
        ))}

        <p className="pt-1 text-[13px] font-semibold uppercase tracking-wide text-brand-700">
          Слова-связки: чтобы ответы звучали связно
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {linkingWords.map((group) => (
            <div key={group.group} className="rounded-lg bg-white/70 px-3 py-2">
              <p className="font-semibold text-ink-900">{group.group}</p>
              <PhraseList phrases={group.words} />
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

/** Устная часть, задание 3: все планы монологов из банка ФИПИ */
export function MonologueBankView() {
  const total = monologueBank.reduce((sum, topic) => sum + topic.talks.length, 0);

  return (
    <details className="rounded-xl border border-ink-200 px-4 py-3">
      <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
        Все темы монологов из банка ФИПИ · {total} планов
      </summary>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed">
        <p className="rounded-lg bg-ink-50 px-3 py-2 text-[13.5px] text-ink-600">
          Инструкция у всех одинаковая: <i>{monologueInstruction}</i> Потренируйтесь
          по каждому плану: 10–12 предложений, вступление, по 2–3 предложения на
          пункт и заключение.
        </p>
        {monologueBank.map((topic) => (
          <details key={topic.topic} className="rounded-lg border border-ink-200 bg-white/60 px-3 py-2">
            <summary className="cursor-pointer font-semibold text-ink-900">
              {topic.topic} · {topic.talks.length}
            </summary>
            <div className="mt-2 space-y-2">
              {topic.talks.map((talk, index) => (
                <div key={index} className="rounded-lg bg-ink-50/70 px-3 py-2">
                  <p className="font-medium text-ink-900">
                    You are going to give a talk about {talk.about}.
                  </p>
                  <ul className="mt-0.5 list-disc pl-5 text-ink-700">
                    {talk.points.map((point) => (
                      <li key={point}>{point};</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </details>
  );
}

/** Идеи для ответов на тему «Родная страна» — монолог, письмо, опрос */
export function HomelandIdeasView() {
  return (
    <details className="rounded-xl border border-ink-200 px-4 py-3">
      <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
        Тема «Родная страна»: идеи для ответов
      </summary>
      <p className="mt-2 text-[13.5px] text-ink-600">
        Пригодится в монологах о путешествиях по России и о семье, в письме
        (например, вопрос о русских городах) и в телефонном опросе.
      </p>
      <div className="mt-3 grid gap-2 text-[14px] leading-relaxed md:grid-cols-2">
        {homelandIdeas.map((block) => (
          <div key={block.title} className="rounded-lg bg-ink-50/70 px-3 py-2">
            <p className="font-semibold text-ink-900">{block.title}</p>
            <ul className="mt-0.5 list-disc pl-5 text-ink-700">
              {block.items.map((item) => (
                <li key={item} className="break-words">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

/** Лексика по темам ОГЭ с семьями слов, суффиксы и слова-ловушки */
export function VocabularyView() {
  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-5">
        <div>
          <h3 className="text-[16px] font-semibold text-ink-900">Лексика по темам ОГЭ</h3>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-600">
            Ключевые слова и выражения по темам, которые встречаются в текстах,
            письме и монологах. Семьи однокоренных слов — готовая тренировка к
            заданиям 29–34: закройте правую часть и попробуйте образовать слова сами.
          </p>
        </div>
        {vocabularyTopics.map((topic, index) => (
          <details key={topic.topic} className="rounded-xl border border-ink-200 px-4 py-3">
            <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
              {index + 1}. {topic.topic}
            </summary>
            <div className="mt-2 grid gap-3 text-[14px] leading-relaxed md:grid-cols-2">
              <div>
                <p className="text-[13px] font-semibold text-ink-600">Слова и выражения</p>
                <PhraseList phrases={topic.words} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-ink-600">Семьи слов (29–34)</p>
                <ul className="space-y-0.5 text-ink-800">
                  {topic.families.map((family) => (
                    <li key={family} className="break-words">
                      {family}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="card space-y-3 p-5">
        <h3 className="text-[16px] font-semibold text-ink-900">
          Суффиксы и приставки для заданий 29–34
        </h3>
        <div className="grid gap-2 text-[14px] leading-relaxed md:grid-cols-2">
          {affixes.map((group) => (
            <div key={group.part} className="rounded-lg bg-ink-50/70 px-3 py-2">
              <p className="font-semibold text-ink-900">{group.part}</p>
              <ul className="mt-0.5 space-y-0.5 text-ink-700">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-3 p-5">
        <div>
          <h3 className="text-[16px] font-semibold text-ink-900">Слова-ловушки</h3>
          <p className="mt-1 text-[14px] text-ink-600">
            Пары слов, которые путают в письме, устной части и заданиях с выбором
            формы.
          </p>
        </div>
        <div className="space-y-2">
          {trapWords.map((trap) => (
            <details key={trap.pair} className="rounded-lg border border-ink-200 px-3 py-2">
              <summary className="cursor-pointer text-[14.5px] font-semibold text-ink-900">
                {trap.pair}
              </summary>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-700">{trap.rule}</p>
              <ul className="mt-1 list-disc pl-5 text-[14px] text-ink-800">
                {trap.examples.map((example) => (
                  <li key={example} className="break-words">
                    {example}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
