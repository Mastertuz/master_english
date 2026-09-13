/**
 * Подробный разбор заданий 20–28 («Грамматика»): что делать с каждой частью
 * речи в скобках. Составлен по видео «Вся грамматика для ОГЭ по английскому»
 * (Алина Максимова, Умскул) — по слайдам и расшифровке; формулировки,
 * примеры, тренировочные предложения и текст для разбора — собственные.
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

/** Мини-текст в формате ОГЭ и ход рассуждений по каждому пропуску */
export type GuideWalkthrough = {
  intro: string;
  /** Текст с пропусками «(n) ___ (WORD)» */
  story: string[];
  gaps: { n: number; word: string; answer: string; reasoning: string }[];
};

export type GrammarGuide = {
  title: string;
  intro: string;
  timing: string;
  steps: string[];
  signals: { signal: string; means: string }[];
  sections: GuideSection[];
  walkthrough: GuideWalkthrough;
  mistakes: string[];
};

export const grammarGuide: GrammarGuide = {
  title: "Как решать задания 20–28: пошаговый разбор",
  intro:
    "В заданиях 20–28 девять пропусков, каждый стоит 1 балл. Слово в скобках нужно поставить в нужную грамматическую форму: само слово и часть речи не меняются, меняется только форма — write → had written, child → children, good → better. Не путайте с заданиями 29–34: они выглядят так же, но там с помощью суффиксов и приставок образуют новое слово (write → writer).",
  timing:
    "На весь раздел «Грамматика и лексика» советуют выделить около 30 минут. Если правила отработаны, задания 20–34 решаются за 15–20 минут — сэкономленное время лучше отдать письму и чтению.",
  steps: [
    "Прочитайте весь текст, не заполняя пропуски, и переведите его для себя: поймите, о чём он и в каком времени идёт рассказ.",
    "Определите часть речи слова в скобках: глагол, существительное, прилагательное или наречие, местоимение, числительное.",
    "Посмотрите, где стоит пропуск: на месте подлежащего, сказуемого, перед существительным, после артикля.",
    "Найдите подсказки: слова-указатели времени, said / told, if, the … in / of, число перед существительным.",
    "Если указателя нет — ориентируйтесь на время всего текста: в рассказе о прошлом сказуемые, как правило, в прошедшем времени.",
    "Выберите форму по правилам части речи (они ниже) и перечитайте предложение с ответом. Проверьте орфографию: ошибка в одной букве — 0 баллов.",
  ],
  signals: [
    { signal: "yesterday, ago, last…, in 2015", means: "Past Simple (или пассив в прошедшем)" },
    { signal: "already, just, yet, ever, never, since, for", means: "Present Perfect, а в рассказе о прошлом — Past Perfect" },
    { signal: "by the time, before + другое прошлое действие", means: "Past Perfect" },
    { signal: "now, at the moment, Look!", means: "Present Continuous" },
    { signal: "said / told / thought (that)", means: "согласование времён: шаг назад во времени" },
    { signal: "said that + будущее (next year, in a couple of years)", means: "would + V" },
    { signal: "if + would в соседней части", means: "условное 2 типа: в части с if Past Simple" },
    { signal: "if + will в соседней части", means: "условное 1 типа: в части с if Present Simple" },
    { signal: "I wish", means: "Past Simple (be → were)" },
    { signal: "подлежащее не может само совершить действие", means: "пассивный залог: be + V3" },
    { signal: "than", means: "сравнительная степень" },
    { signal: "the ___ + in / of / ever", means: "превосходная степень" },
    { signal: "the ___ + time / floor / birthday", means: "порядковое числительное" },
    { signal: "число, many, few, several перед пропуском", means: "множественное число существительного" },
  ],
  sections: [
    {
      id: "noun",
      title: "Существительное → множественное число",
      when: "В скобках существительное, а перед пропуском many, few, several, some, most, these, those или число; глагол после пропуска во множественном числе (are, were, have). Это один из самых лёгких баллов — правил немного.",
      rules: [
        "Обычно добавляем -s: book → books, apple → apples.",
        "После -s, -ss, -sh, -ch, -x — окончание -es: bus → buses, dress → dresses, box → boxes, watch → watches.",
        "Согласная + y → -ies: city → cities, family → families. Гласная + y → просто -s: boy → boys, day → days.",
        "Часть слов на -f / -fe → -ves: leaf → leaves, knife → knives, wife → wives (но roof → roofs).",
        "Некоторые слова на -o → -es: potato → potatoes, tomato → tomatoes, hero → heroes (но photo → photos, piano → pianos).",
      ],
      tables: [
        {
          caption: "Исключения — именно их чаще всего и дают в заданиях",
          table: {
            head: ["Единственное", "Множественное", "Единственное", "Множественное"],
            rows: [
              ["man (policeman…)", "men (policemen…)", "goose", "geese"],
              ["woman", "women", "mouse", "mice"],
              ["child", "children", "person", "people"],
              ["tooth", "teeth", "ox", "oxen"],
              ["foot", "feet", "sheep / fish / deer", "не меняются"],
            ],
          },
        },
      ],
      tips: [
        "Чаще всего встречаются children, men / women (и слова на -man: policeman → policemen) и people. Реже — feet, teeth, mice.",
        "Person во множественном числе — people, а не persons. Children, people, men уже множественное: childrens и peoples — ошибка.",
        "Women произносится /ˈwɪmɪn/, но пишется через o — частая орфографическая ошибка.",
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
      when: "В скобках I, YOU, HE, SHE, IT, WE, THEY. Всё, что можно сделать с местоимением, — поменять его форму: смотрите, какую роль слово играет в предложении.",
      rules: [
        "Кто? Что? — подлежащее перед глаголом → личная форма: They went home.",
        "Кого? Кому? Кем? — объектный падеж, по сути все падежи, кроме именительного. Стоит после глагола или предлога: Do you like me? It's for them.",
        "Чей? — перед существительным → притяжательная форма: This is my pen. Their house.",
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
        "Its (чей?) пишется без апострофа. It's — сокращение it is или it has. На этой разнице теряют много обидных баллов.",
        "Her — и «её» объектная, и «её» притяжательная: решает, стоит ли после пропуска существительное.",
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
        "Количественное числительное меняем на порядковое — «который по счёту». Почти всегда оно стоит с the: the fifth floor.",
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
              ["two", "second", "особая форма, c в середине"],
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
        "Балл лёгкий, но только при верном написании. Порядковые числительные полезно несколько раз написать от руки, чтобы рука запомнила форму.",
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
      when: "После пропуска than — сравнительная степень. Перед пропуском the, а дальше in / of / ever или по смыслу «самый» — превосходная.",
      rules: [
        "Короткие слова (один слог и двусложные на -y): -er / the -est. tall → taller → the tallest, pretty → prettier → the prettiest.",
        "Удваиваем последнюю согласную после одной краткой гласной: big → bigger → the biggest, hot → hotter.",
        "На -e добавляем только -r / -st: large → larger → the largest.",
        "Длинные слова: more / the most. interesting → more interesting → the most interesting.",
        "В сочетании as ___ as слово остаётся в начальной форме: as tall as.",
      ],
      tables: [
        {
          caption: "Исключения — на них ловят чаще всего",
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
        "Никаких gooder, the goodest, badder: только исключения из таблицы.",
        "Elder / eldest — только о членах семьи: my elder brother, the eldest son.",
        "Если the уже стоит перед пропуском, в ответ его не пишем: the ___ (LARGE) agency in the town → largest.",
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
      when: "В скобках глагол, пропуск стоит на месте сказуемого, и подлежащее само выполняет действие. С глаголом правил больше всего, поэтому именно здесь «начинается веселье».",
      rules: [
        "В заданиях 20–28 глагол нужен в личной форме — той, что меняется по временам и стоит на месте сказуемого.",
        "Понимайте смысл групп, а не зубрите формулы: Simple — факт, единичное или регулярное действие; Continuous — процесс, длится во времени (всегда -ing); Perfect — результат к какому-то моменту (всегда V3).",
        "Сначала определите время всего текста: если рассказ о прошлом, большинство ответов — Past Simple.",
        "Согласуйте глагол с подлежащим: he / she / it → -s в Present Simple; they, her plans → were, have.",
        "Если в скобках отрицание (NOT CAN, NOT MIND), оно обязательно входит в ответ: couldn't, didn't mind. Модальные в прошлом: can → could, may → might, must → had to.",
        "Неправильные глаголы берут вторую форму для Past Simple и третью — для Perfect: go — went — gone.",
      ],
      tables: [
        {
          caption: "Семь времён, которые встречаются в ОГЭ",
          table: {
            head: ["Время", "Формула", "Когда и маркеры", "Пример"],
            rows: [
              ["Present Simple", "V / Vs", "факты, привычки, расписание: usually, every day, always", "She works in a bank."],
              ["Past Simple", "V2 / Ved", "факт в прошлом: yesterday, ago, last…, in 2015", "We visited Kazan last year."],
              ["Future Simple", "will + V", "факт в будущем: tomorrow, next…, I think", "I will call you later."],
              ["Present Continuous", "am / is / are + Ving", "происходит прямо сейчас: now, at the moment, Look!", "They are playing now."],
              ["Past Continuous", "was / were + Ving", "шло в процессе в прошлом: while, at 5 pm yesterday", "He was reading when I came."],
              ["Present Perfect", "have / has + V3", "результат к настоящему: already, just, yet, ever, since, for", "I have lost my keys."],
              ["Past Perfect", "had + V3", "раньше другого прошлого: before, by the time, already в рассказе", "The film had started before we arrived."],
            ],
          },
        },
      ],
      tips: [
        "Легко запомнить Perfect: в настоящем have / has — первая форма have, в прошедшем had — его вторая форма.",
        "В кодификатор добавлен Present Perfect Continuous (have / has been + Ving). В заданиях 20–28 его пока не было, но знать его нужно. Future Continuous и Future Perfect в ОГЭ не нужны.",
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
      when: "Задайте вопрос: подлежащее само совершает действие или его совершают над ним? «Статья сама себя опубликовала?» — нет, её опубликовали. Значит, нужен пассив. Часто рядом by + исполнитель.",
      rules: [
        "Формула пассива одна: be в нужном времени + третья форма глагола (V3 / Ved).",
        "Время определяем так же, как в активном залоге, по указателям — меняется только форма be: am / is / are, was / were, will be, have / has been.",
        "Проверьте число подлежащего: The house was built, но The houses were built.",
      ],
      tables: [
        {
          caption: "Пассив в ОГЭ",
          table: {
            head: ["Время", "Формула", "Пример"],
            rows: [
              ["Present Simple Passive", "am / is / are + V3", "English is spoken all over the world."],
              ["Past Simple Passive", "was / were + V3", "The bridge was built in 1890."],
              ["Future Simple Passive", "will be + V3", "The results will be announced tomorrow."],
              ["Present Perfect Passive", "have / has been + V3", "The windows have just been cleaned."],
            ],
          },
        },
      ],
      tips: [
        "Если знаете, как ведёт себя be в разных временах, отдельно учить формулы пассива не нужно: берёте нужную форму be и добавляете V3.",
      ],
      practice: [
        {
          task: "The first photos of the Earth from space ___ (TAKE) in 1946.",
          answer: "were taken",
          why: "Фотографии сами себя не сняли — пассив; прошлое, множественное число: were + V3.",
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
      when: "Перед пропуском said (that), told, thought, knew — главный глагол в прошедшем, а слова человека пересказаны без кавычек. Это «жёсткая подсказка» на косвенную речь, и именно она чаще всего подводит неподготовленных.",
      rules: [
        "При переходе в косвенную речь время делает шаг назад: Present → Past, Past → Past Perfect.",
        "Past Perfect шагать некуда — он остаётся Past Perfect.",
        "Future Simple превращается в «будущее в прошедшем» (future in the past): will → would + V.",
        "Указатель будущего (next week, in a couple of years) вместе с said — сигнал поставить would.",
        "Местоимения меняются по смыслу: “I will…” → he would…",
      ],
      tables: [
        {
          caption: "Шаг назад во времени",
          table: {
            head: ["Прямая речь", "Косвенная речь (после said)"],
            rows: [
              ["Present Simple: “I write”", "Past Simple: he wrote"],
              ["Present Continuous: “I am writing”", "Past Continuous: he was writing"],
              ["Present Perfect: “I have written”", "Past Perfect: he had written"],
              ["Past Simple: “I wrote”", "Past Perfect: he had written"],
              ["Past Perfect: “I had written”", "Past Perfect: he had written"],
              ["Future Simple: “I will write”", "would + V: he would write"],
              ["can / may / must", "could / might / had to"],
            ],
          },
        },
      ],
      tips: [
        "Если said в настоящем времени (says), время не сдвигается: She says she likes it.",
        "Past Continuous в косвенной речи превращается в Past Perfect Continuous, но в ОГЭ это не проверяют.",
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
      when: "В предложении есть if или I wish. Тип условного определяйте по второй, главной части: will — 1 тип, would — 2 тип.",
      rules: [
        "Условное предложение состоит из условия (часть с if) и следствия (главная часть). Тип зависит от того, насколько реально условие.",
        "1 тип — реально выполнимо в настоящем или будущем: If + Present Simple, … will + V. If the weather is fine, we will go for a walk.",
        "2 тип — воображаемое, сейчас невозможное: If + Past Simple, … would + V. If the weather were fine, we would go for a walk (но погода плохая).",
        "Во 2 типе be — were со всеми подлежащими: If I were…, if it were…",
        "В части с if никогда не ставим will или would.",
        "I wish — когда что-то сейчас не устраивает и хочется, чтобы было иначе. После I wish — Past Simple, be снова were: I wish I were at the seaside. I wish I could play the guitar.",
      ],
      tables: [
        {
          table: {
            head: ["Тип", "Часть с if", "Главная часть", "Значение"],
            rows: [
              ["1", "If + Present Simple (V / Vs)", "will + V", "реально, может случиться"],
              ["2", "If + Past Simple (V2 / Ved, were)", "would + V", "нереально, воображаемо"],
              ["I wish", "I wish + Past Simple (were, could)", "—", "жаль, что сейчас не так"],
            ],
          },
        },
      ],
      tips: [
        "Пропуск в части с if, а в главной части would — это 2 тип, в пропуск ставим Past Simple, даже если по смыслу речь о «сейчас»: If I ___ (HAVE) it now, I would… → had.",
        "В кодификатор добавлен нулевой тип (If + Present Simple, … Present Simple — общие истины). В заданиях 20–28 его пока не было, но его стоит знать.",
        "Тему I wish проходят не во всех школах. Она простая, но незнакомая форма на экзамене сбивает — разберите заранее.",
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
      when: "В заданиях 20–28 проверяют личные формы глагола. Неличные формы — причастия, инфинитив и герундий — нужны, чтобы грамотно писать письмо и говорить в устной части, и помогают не ошибиться с to и -ing.",
      rules: [
        "Неличная форма не меняется по временам и не может быть сказуемым сама по себе.",
        "Герундий (Ving) — после предлогов и глаголов enjoy, finish, mind, avoid, stop, keep, practise: She enjoys dancing. He is good at swimming.",
        "Инфинитив с to (to V) — после want, decide, plan, hope, agree, promise, would like, а также после прилагательных: easy to learn.",
        "Инфинитив без to (V) — после модальных глаголов (can, must, should) и после make, let: They let us go.",
        "Причастие I (Ving) — «делающий»: a sleeping baby. Причастие II (V3 / Ved) — «сделанный»: a broken window.",
      ],
      tables: [],
      tips: [
        "Если перед пропуском уже есть сказуемое (decided, enjoy, can), в пропуск идёт не личная форма, а to V, V или Ving.",
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
  walkthrough: {
    intro:
      "Так рассуждают над настоящим текстом: переводим, находим подсказку, определяем часть речи и тему, ставим форму. Сначала попробуйте заполнить пропуски сами, потом откройте разбор.",
    story: [
      "Last summer Tim (1) ___ (WANT) to buy a new bike, but he didn't have enough money.",
      "Two (2) ___ (PERSON) from his street offered him a job in their garden.",
      "His mum said that she (3) ___ (HELP) him with the rest of the money in autumn.",
      "Tim worked hard, and by the end of August he (4) ___ (SAVE) almost everything he needed.",
      "“If I (5) ___ (BE) a bit older, I would find a better job,” he thought.",
      "Finally, the bike (6) ___ (BUY) on his birthday, and it was the (7) ___ (HAPPY) day of his summer.",
    ],
    gaps: [
      {
        n: 1,
        word: "WANT",
        answer: "wanted",
        reasoning: "Глагол на месте сказуемого, указатель Last summer и весь рассказ — о прошлом. Tim сам хотел — активный залог, Past Simple, правильный глагол: -ed.",
      },
      {
        n: 2,
        word: "PERSON",
        answer: "people",
        reasoning: "Существительное после числа Two — множественное число. Person — исключение: people.",
      },
      {
        n: 3,
        word: "HELP",
        answer: "would help",
        reasoning: "Жёсткая подсказка said that — косвенная речь. Помочь она обещала в будущем (in autumn): в прямой речи было “I will help you”, после said will → would.",
      },
      {
        n: 4,
        word: "SAVE",
        answer: "had saved",
        reasoning: "by the end of August — к моменту в прошлом деньги уже были накоплены: результат к моменту в прошлом — Past Perfect, had + V3.",
      },
      {
        n: 5,
        word: "BE",
        answer: "were",
        reasoning: "Подсказка if, а в главной части would — условное 2 типа. В части с if Past Simple, be со всеми подлежащими — were.",
      },
      {
        n: 6,
        word: "BUY",
        answer: "was bought",
        reasoning: "Велосипед сам себя не купил — над ним совершили действие, пассивный залог. Рассказ в прошлом, подлежащее в единственном числе: was + V3 (buy — bought — bought).",
      },
      {
        n: 7,
        word: "HAPPY",
        answer: "happiest",
        reasoning: "Прилагательное после the и сравнение со всем летом (of his summer) — превосходная степень. Двусложное на -y: y → i + est. The уже стоит в тексте.",
      },
    ],
  },
  mistakes: [
    "Не определили время всего текста: в рассказе о прошлом поставили Present Simple.",
    "Не согласовали глагол с подлежащим во множественном числе: her plans was вместо were.",
    "Не заметили пассив: подлежащее не может само совершить действие, а be забыли.",
    "Потеряли отрицание из скобок: NOT CAN → could вместо couldn't.",
    "Определили тип условного не по главной части и поставили will или would в часть с if.",
    "Пропустили сдвиг времён после said: will вместо would.",
    "Дописали the, который уже стоит перед пропуском: the the largest.",
    "Ошиблись в написании: twelveth, secound, childs, womens, stoped.",
  ],
};
