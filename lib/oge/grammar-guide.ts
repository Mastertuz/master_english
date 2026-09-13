/**
 * Подробный разбор заданий 20–28 («Грамматика»): что делать с каждой частью
 * речи в скобках. Составлен по темам видео «Вся грамматика для ОГЭ по
 * английскому» (Алина Максимова, Умскул); формулировки, примеры и
 * тренировочные предложения — собственные.
 */

export type GuideTable = { head: string[]; rows: string[][] };

export type GuidePractice = {
  /** Предложение с пропуском «___» и словом в скобках заглавными */
  task: string;
  answer: string;
  why: string;
};

export type GuideSection = {
  id: string;
  title: string;
  /** Как понять, что нужна именно эта тема */
  when: string;
  rules: string[];
  tables: { caption?: string; table: GuideTable }[];
  tips: string[];
  practice: GuidePractice[];
};

export type GrammarGuide = {
  title: string;
  intro: string;
  steps: string[];
  sections: GuideSection[];
  mistakes: string[];
  source: { title: string; url: string };
};

export const grammarGuide: GrammarGuide = {
  title: "Как решать задания 20–28: пошаговый разбор",
  intro:
    "В заданиях 20–28 девять пропусков, каждый стоит 1 балл. Слово в скобках нужно поставить в нужную грамматическую форму — само слово не меняется, меняется только его форма: write → wrote, child → children, good → better. Не путайте с заданиями 29–34: там образуют новое однокоренное слово (write → writer).",
  steps: [
    "Прочитайте весь текст, не заполняя пропуски: поймите, о чём он и в каком времени идёт рассказ.",
    "Определите часть речи слова в скобках: глагол, существительное, прилагательное или наречие, местоимение, числительное.",
    "Посмотрите на соседей пропуска: подлежащее, артикль, предлог, союз if, слова said / told, маркеры времени (yesterday, already, now).",
    "Выберите форму по правилам своей части речи — они собраны ниже.",
    "Перечитайте предложение с ответом и проверьте орфографию: ошибка в одной букве — 0 баллов.",
  ],
  sections: [
    {
      id: "noun",
      title: "Существительное → множественное число",
      when: "Перед пропуском many, few, several, some, these, those, most, all, число; глагол после пропуска во множественном числе (are, were, have).",
      rules: [
        "Обычно добавляем -s: book → books, apple → apples.",
        "После -s, -ss, -sh, -ch, -x — окончание -es: bus → buses, dress → dresses, box → boxes, watch → watches.",
        "Согласная + y → -ies: city → cities, family → families. Гласная + y → просто -s: boy → boys, day → days.",
        "Часть слов на -f / -fe → -ves: leaf → leaves, knife → knives, wife → wives (но roof → roofs).",
        "Некоторые слова на -o → -es: potato → potatoes, tomato → tomatoes, hero → heroes (но photo → photos, piano → pianos).",
      ],
      tables: [
        {
          caption: "Исключения — выучить наизусть",
          table: {
            head: ["Единственное", "Множественное", "Единственное", "Множественное"],
            rows: [
              ["man", "men", "goose", "geese"],
              ["woman", "women", "mouse", "mice"],
              ["child", "children", "person", "people"],
              ["tooth", "teeth", "ox", "oxen"],
              ["foot", "feet", "sheep / fish / deer", "не меняются"],
            ],
          },
        },
      ],
      tips: [
        "Women произносится /ˈwɪmɪn/, но пишется через o — частая орфографическая ошибка.",
        "Children, people, men уже множественное число: childrens и peoples — ошибка.",
      ],
      practice: [
        {
          task: "There were at least twenty ___ (CHILD) at the birthday party.",
          answer: "children",
          why: "twenty — число больше одного, child — исключение: children.",
        },
        {
          task: "The dentist said that two of my ___ (TOOTH) needed treatment.",
          answer: "teeth",
          why: "two of my — нужно множественное число, tooth → teeth.",
        },
      ],
    },
    {
      id: "pronoun",
      title: "Местоимение → нужный падеж",
      when: "В скобках I, YOU, HE, SHE, IT, WE, THEY. Смотрите, какую роль слово играет в предложении.",
      rules: [
        "Кто? Что? — подлежащее перед глаголом → личная форма: They went home.",
        "Кого? Кому? — после глагола или предлога → объектная форма: Call me. It's for them.",
        "Чей? — перед существительным → притяжательная форма: their house, its colour.",
        "Чей? без существительного после → абсолютная форма: The bag is mine.",
        "Сам, себя → возвратная форма: They enjoyed themselves.",
      ],
      tables: [
        {
          table: {
            head: ["Личная (кто?)", "Объектная (кого? кому?)", "Притяжательная (чей? + сущ.)", "Абсолютная (чей? без сущ.)", "Возвратная (себя)"],
            rows: [
              ["I", "me", "my", "mine", "myself"],
              ["you", "you", "your", "yours", "yourself / yourselves"],
              ["he", "him", "his", "his", "himself"],
              ["she", "her", "her", "hers", "herself"],
              ["it", "it", "its", "—", "itself"],
              ["we", "us", "our", "ours", "ourselves"],
              ["they", "them", "their", "theirs", "themselves"],
            ],
          },
        },
      ],
      tips: [
        "Its (чей?) пишется без апострофа. It's — это it is или it has.",
        "Her — и «её» (объектная), и «её» (притяжательная): решает, стоит ли после пропуска существительное.",
      ],
      practice: [
        {
          task: "The cat was playing with ___ (IT) toy mouse.",
          answer: "its",
          why: "Перед существительным toy mouse — притяжательная форма, без апострофа.",
        },
        {
          task: "Our teacher gave ___ (WE) a lot of homework yesterday.",
          answer: "us",
          why: "Кому дали? — объектная форма после глагола gave.",
        },
      ],
    },
    {
      id: "numeral",
      title: "Числительное → порядковое",
      when: "В скобках число словом (TWO, NINE, TWELVE), а перед пропуском the или притяжательное местоимение: the ___ time / floor / place / century, her ___ birthday.",
      rules: [
        "Порядковое числительное отвечает на вопрос «который?» и почти всегда стоит с the: the fifth floor.",
        "Большинство образуется с -th: four → fourth, six → sixth, ten → tenth.",
        "У 1, 2, 3 особые формы: first, second, third — и в составных тоже: twenty-first, thirty-second.",
      ],
      tables: [
        {
          caption: "Где чаще всего ошибаются в написании",
          table: {
            head: ["Число", "Порядковое", "Что меняется"],
            rows: [
              ["one", "first", "особая форма"],
              ["two", "second", "особая форма"],
              ["three", "third", "особая форма"],
              ["five", "fifth", "ve → f"],
              ["eight", "eighth", "одна t, добавляем h"],
              ["nine", "ninth", "e исчезает"],
              ["twelve", "twelfth", "ve → f"],
              ["twenty", "twentieth", "y → ie"],
            ],
          },
        },
      ],
      tips: [
        "Если перед пропуском нет the и речь о количестве («у нас пять уроков»), число не меняется — такие пропуски в 20–28 не дают.",
      ],
      practice: [
        {
          task: "My grandmother celebrated her ___ (NINETY) birthday last month.",
          answer: "ninetieth",
          why: "her ___ birthday — «который по счёту», y → ie + th.",
        },
        {
          task: "It was already the ___ (THREE) time she had called me that day.",
          answer: "third",
          why: "the ___ time — порядковое числительное, у three особая форма.",
        },
      ],
    },
    {
      id: "adjective",
      title: "Прилагательное и наречие → степень сравнения",
      when: "После пропуска than — сравнительная степень. Перед пропуском the, а дальше in / of / ever / «один из» — превосходная.",
      rules: [
        "Короткие слова (один слог и двусложные на -y): -er / the -est. tall → taller → the tallest, happy → happier → the happiest.",
        "Удваиваем последнюю согласную после одной краткой гласной: big → bigger → the biggest, hot → hotter.",
        "На -e добавляем только -r / -st: large → larger → the largest.",
        "Длинные слова: more / the most. interesting → more interesting → the most interesting.",
        "В сочетании as ___ as слово остаётся в начальной форме: as tall as.",
      ],
      tables: [
        {
          caption: "Исключения",
          table: {
            head: ["Начальная", "Сравнительная", "Превосходная"],
            rows: [
              ["good / well", "better", "the best"],
              ["bad / badly", "worse", "the worst"],
              ["little", "less", "the least"],
              ["many / much", "more", "the most"],
              ["far", "farther / further", "the farthest / the furthest"],
              ["old", "older / elder", "the oldest / the eldest"],
            ],
          },
        },
      ],
      tips: [
        "Если the уже стоит перед пропуском, в ответ его не пишем: the ___ (FAMOUS) → most famous.",
        "Elder / eldest — только о членах семьи: my elder brother.",
      ],
      practice: [
        {
          task: "It was the ___ (BAD) storm the village had seen in fifty years.",
          answer: "worst",
          why: "the + сравнение со всеми за пятьдесят лет — превосходная степень, исключение bad.",
        },
        {
          task: "The new road is much ___ (WIDE) than the old one.",
          answer: "wider",
          why: "than — сравнительная степень, на -e добавляем только -r.",
        },
      ],
    },
    {
      id: "tenses",
      title: "Глагол → время активного залога",
      when: "В скобках глагол, а подлежащее само выполняет действие. Время подсказывают маркеры и время всего рассказа.",
      rules: [
        "Сначала определите, в каком времени идёт текст: если рассказ о прошлом, большинство ответов — Past Simple.",
        "Согласуйте глагол с подлежащим: he / she / it → -s в Present Simple; they / her plans → were, have.",
        "Если в скобках отрицание (NOT CAN, NOT MIND), оно обязательно входит в ответ: couldn't, didn't mind.",
        "Модальные глаголы в прошлом: can → could, may → might, must → had to.",
        "Неправильные глаголы берут вторую форму для Past Simple и третью — для Perfect: go — went — gone.",
      ],
      tables: [
        {
          caption: "Семь времён, которые встречаются в ОГЭ",
          table: {
            head: ["Время", "Формула", "Когда и маркеры", "Пример"],
            rows: [
              ["Present Simple", "V / Vs", "факты, привычки: usually, every day, always", "She works in a bank."],
              ["Past Simple", "V2 / Ved", "завершено в прошлом: yesterday, ago, last…, in 2015", "We visited Kazan last year."],
              ["Future Simple", "will + V", "будущее: tomorrow, next…, I think", "I will call you later."],
              ["Present Continuous", "am / is / are + Ving", "происходит сейчас: now, at the moment, Look!", "They are playing now."],
              ["Past Continuous", "was / were + Ving", "шло в момент прошлого: while, at 5 pm yesterday", "He was reading when I came."],
              ["Present Perfect", "have / has + V3", "результат к настоящему: already, just, yet, ever, since, for", "I have lost my keys."],
              ["Past Perfect", "had + V3", "раньше другого прошлого: before, by the time, already в рассказе", "The film had started before we arrived."],
            ],
          },
        },
      ],
      tips: [
        "Future Continuous, Future Perfect и времена Perfect Continuous в заданиях 20–28 практически не встречаются — сосредоточьтесь на семи временах из таблицы.",
        "Проверяйте удвоение и изменение букв: stop → stopped, plan → planning, try → tried, make → making.",
      ],
      practice: [
        {
          task: "By the time we got to the cinema, the film ___ (START).",
          answer: "had started",
          why: "Фильм начался раньше, чем мы пришли, — действие раньше другого прошлого, Past Perfect.",
        },
        {
          task: "His sisters ___ (BE) very excited about the trip to the mountains.",
          answer: "were",
          why: "Рассказ в прошлом, подлежащее His sisters во множественном числе — were.",
        },
      ],
    },
    {
      id: "passive",
      title: "Глагол → страдательный залог",
      when: "Подлежащее не делает действие, а над ним его совершают: the letter, the bridge, the museum. Часто рядом by + исполнитель.",
      rules: [
        "Формула пассива: be в нужном времени + третья форма глагола (V3 / Ved).",
        "Время определяем так же, как в активном залоге, — меняется только форма be.",
        "Проверьте число подлежащего: The house was built, но The houses were built.",
      ],
      tables: [
        {
          caption: "Три времени пассива в ОГЭ",
          table: {
            head: ["Время", "Формула", "Пример"],
            rows: [
              ["Present Simple Passive", "am / is / are + V3", "English is spoken all over the world."],
              ["Past Simple Passive", "was / were + V3", "The bridge was built in 1890."],
              ["Future Simple Passive", "will be + V3", "The results will be announced tomorrow."],
            ],
          },
        },
      ],
      tips: [
        "Если без be фраза означает, что предмет сам совершил действие («мост построил»), — нужен пассив.",
      ],
      practice: [
        {
          task: "The first photos of the Earth from space ___ (TAKE) in 1946.",
          answer: "were taken",
          why: "Фотографии не снимали сами — пассив; прошлое, множественное число: were + V3.",
        },
        {
          task: "The winners of the competition ___ (ANNOUNCE) next Friday.",
          answer: "will be announced",
          why: "Победителей объявят (не они объявят) — пассив в будущем: will be + V3.",
        },
      ],
    },
    {
      id: "reported",
      title: "Глагол после said / told → согласование времён",
      when: "Перед пропуском said (that), told, thought, knew, hoped — главный глагол в прошедшем времени.",
      rules: [
        "Если слова автора в прошедшем времени, время в пересказе сдвигается на шаг в прошлое.",
        "Будущее с точки зрения прошлого (future in the past): will → would + V.",
        "Слова, указывающие на будущее (next week, in a couple of years), вместе с said подсказывают would.",
      ],
      tables: [
        {
          caption: "Как сдвигаются времена",
          table: {
            head: ["Прямая речь", "Косвенная речь (после said)"],
            rows: [
              ["Present Simple: “I write”", "Past Simple: he wrote"],
              ["Present Continuous: “I am writing”", "Past Continuous: he was writing"],
              ["Present Perfect: “I have written”", "Past Perfect: he had written"],
              ["Past Simple: “I wrote”", "Past Perfect: he had written"],
              ["will: “I will write”", "would: he would write"],
              ["can / may / must", "could / might / had to"],
            ],
          },
        },
      ],
      tips: [
        "Если said в настоящем времени (says), время не сдвигается: She says she likes it.",
      ],
      practice: [
        {
          task: "Mum said that she ___ (BUY) me a new phone for my birthday next month.",
          answer: "would buy",
          why: "said в прошлом + будущее действие (next month) — would + V.",
        },
        {
          task: "Kate told me that she ___ (LOSE) her phone on the way to school.",
          answer: "had lost",
          why: "В прямой речи было “I have lost my phone”, после told Present Perfect сдвигается в Past Perfect.",
        },
      ],
    },
    {
      id: "conditional",
      title: "Условные предложения и I wish",
      when: "В предложении есть if или I wish; во второй части стоит will или would.",
      rules: [
        "1 тип — реальное условие: If + Present Simple, … will + V. If it rains, we will stay at home.",
        "2 тип — нереальное или воображаемое условие в настоящем: If + Past Simple, … would + V. If I had more time, I would learn Chinese.",
        "В части с if никогда не ставим will или would.",
        "Во 2 типе be обычно were для всех лиц: If I were you…",
        "I wish + Past Simple — сожаление о настоящем: I wish I lived near the sea (а живу далеко).",
      ],
      tables: [
        {
          table: {
            head: ["Тип", "Часть с if", "Главная часть", "Значение"],
            rows: [
              ["1", "If + Present Simple (V / Vs)", "will + V", "реально, может случиться"],
              ["2", "If + Past Simple (V2 / Ved)", "would + V", "нереально, воображаемо"],
              ["I wish", "I wish + Past Simple", "—", "жаль, что сейчас не так"],
            ],
          },
        },
      ],
      tips: [
        "Смотрите на вторую часть: would в ней — сигнал поставить Past Simple в часть с if, даже если речь о настоящем (If I ___ (HAVE) it now, I would… → had).",
      ],
      practice: [
        {
          task: "If you ___ (LEAVE) now, you will catch the last bus.",
          answer: "leave",
          why: "Во второй части will — 1 тип, в части с if Present Simple.",
        },
        {
          task: "I wish my best friend ___ (LIVE) closer to me.",
          answer: "lived",
          why: "I wish + Past Simple — сожаление о том, что сейчас не так.",
        },
      ],
    },
    {
      id: "nonfinite",
      title: "Неличные формы глагола: -ing, to V, V3",
      when: "Перед пропуском уже есть глагол, предлог или модальный глагол — нужна форма, которая не меняется по временам.",
      rules: [
        "Герундий (Ving) — после предлогов и глаголов enjoy, finish, mind, avoid, stop, keep, practise: She enjoys dancing. He is good at swimming.",
        "Инфинитив с to (to V) — после want, decide, plan, hope, agree, promise, would like, а также после прилагательных: easy to learn.",
        "Инфинитив без to (V) — после модальных глаголов (can, must, should) и после make, let: They let us go.",
        "Причастие I (Ving) — «делающий»: a sleeping baby.",
        "Причастие II (V3 / Ved) — «сделанный»: a broken window, фото, taken last year.",
      ],
      tables: [],
      tips: [
        "В заданиях 20–28 чаще проверяют личные формы, но неличные нужны, чтобы не ошибиться с частицей to и окончанием -ing.",
      ],
      practice: [
        {
          task: "We decided ___ (GO) to the seaside instead of the mountains.",
          answer: "to go",
          why: "После decide — инфинитив с to.",
        },
        {
          task: "Would you mind ___ (OPEN) the window?",
          answer: "opening",
          why: "После mind — герундий.",
        },
      ],
    },
  ],
  mistakes: [
    "Не определили время всего текста: в рассказе о прошлом поставили Present Simple.",
    "Не согласовали глагол с подлежащим во множественном числе: her plans was вместо were.",
    "Потеряли отрицание из скобок: NOT CAN → could вместо couldn't.",
    "Поставили will или would в часть с if.",
    "Пропустили сдвиг времён после said: will вместо would.",
    "Дописали the, который уже стоит перед пропуском: the the most famous.",
    "Ошиблись в написании: twelveth, ninteenth, childs, womens, stoped.",
  ],
  source: {
    title: "«Вся грамматика для ОГЭ по английскому» — Алина Максимова, Умскул",
    url: "https://www.youtube.com/watch?v=CdAtjDXZdMQ",
  },
};
