import type { Drill } from "./types";

/** Грамматика Empower C1, юниты 2–7 */

export const NARRATIVE_DRILL: Drill = {
  id: "narrative",
  title: "Рассказ в прошлом и «будущее в прошедшем»",
  tag: "Empower Unit 3B",
  rule: [
    "Рассказ строится на четырёх формах: Past Simple — главные события по порядку; Past Continuous — фон и процессы в этот момент; Past Perfect — то, что было до; Past Perfect Continuous — длительность до события.",
    "Будущее в прошедшем: was / were going to, was about to, was due to, would + инфинитив — о том, что тогда ещё не произошло. We were about to leave when it started to rain. I knew I would pass.",
    "Little did she know… — драматичный приём: Little did she know that her life was about to change.",
  ],
  examples: [
    "While I was walking along the beach, I found an old bottle.",
    "They had been married for ten years when they divorced.",
    "The train was due to leave at nine, but it was delayed.",
  ],
  items: [
    { id: "nar-1", q: "We ___ to leave when it started to rain.", options: ["were about", "had been about", "are about", "would be about"], answer: "were about", why: "Was / were about to + инфинитив: «вот-вот собирались»." },
    { id: "nar-2", q: "I was sure that I ___ the exam the next day.", options: ["will take", "would take", "take", "had taken"], answer: "would take", why: "Будущее в прошедшем: would + инфинитив." },
    { id: "nar-3", q: "She was ___ to call him, but she lost his number.", options: ["going", "will going", "about", "going on"], answer: "going", why: "Was going to: намеревалась, но не сделала." },
    { id: "nar-4", q: "While I ___ along the beach, I found an old bottle.", options: ["walked", "was walking", "had walked", "walk"], answer: "was walking", why: "Фоновое действие в процессе: Past Continuous." },
    { id: "nar-5", q: "He ___ for hours when the car finally broke down.", options: ["drove", "had been driving", "was drive", "has driven"], answer: "had been driving", why: "Длительность до события в прошлом." },
    { id: "nar-6", q: "Little did she know that her life ___ forever.", options: ["was about to change", "is about to change", "had changed", "changes"], answer: "was about to change", why: "Inversion Little did + будущее в прошедшем." },
    { id: "nar-7", q: "We ___ (be) just about to leave when the phone rang.", answer: "were", why: "Was / were about to." },
    { id: "nar-8", q: "They ___ married for ten years when they divorced.", options: ["were", "had been", "have been", "had"], answer: "had been", why: "Состояние до события в прошлом: Past Perfect." },
    { id: "nar-9", q: "I thought I ___ the window, but it was open.", options: ["closed", "had closed", "would close", "was closing"], answer: "had closed", why: "Действие раньше момента мысли: Past Perfect." },
    { id: "nar-10", q: "She wasn't sure whether she ___ able to finish on time.", options: ["would be", "will be", "is", "had been"], answer: "would be", why: "Будущее в прошедшем после past: would." },
    { id: "nar-11", q: "The train ___ leave at nine, but it was delayed.", options: ["was due to", "has to", "will", "had been"], answer: "was due to", why: "Was due to: по расписанию должен был." },
    { id: "nar-12", q: "It was the best holiday I ___ (ever / have).", answer: "had ever had", why: "После превосходной степени в прошлом: Past Perfect." },
  ],
};

export const COMPARISON_DRILL: Drill = {
  id: "comparison",
  title: "Сравнение, намерения и договорённости",
  tag: "Empower Unit 2A–2B",
  rule: [
    "Усиление сравнения: much / a lot / far / considerably + сравнительная степень; slightly / a bit / marginally — слегка; nowhere near as … as / not nearly as … as — «совсем не такой, как». Двойное сравнение: The more you practise, the better you become.",
    "Намерения и договорённости: be planning / intending / aiming to; be going to; be due to (по расписанию); have arranged to; Present Continuous для заранее оговорённого (I'm meeting Anna at six). Was going to + инфинитив — намерение, которое не осуществилось.",
    "Наречия: dramatically, steadily, considerably — для описания изменений.",
  ],
  examples: [
    "The film was nowhere near as good as the book.",
    "The more you practise, the better you become.",
    "I was going to apply, but I changed my mind.",
  ],
  items: [
    { id: "cmp-1", q: "The film was ___ as good as the book.", options: ["nowhere near", "much", "by far", "far more"], answer: "nowhere near", why: "Nowhere near as … as: далеко не так хорош." },
    { id: "cmp-2", q: "The more you practise, ___ you become.", options: ["the better", "better", "the best", "more better"], answer: "the better", why: "The more …, the + сравнительная." },
    { id: "cmp-3", q: "This is by far ___ restaurant in town.", options: ["the best", "best", "better", "the better"], answer: "the best", why: "By far + превосходная степень." },
    { id: "cmp-4", q: "She's ___ taller than her brother.", options: ["a lot", "very", "the most", "so"], answer: "a lot", why: "A lot / much / far + сравнительная степень; very с ней не используется." },
    { id: "cmp-5", q: "I'm planning ___ a new job next month.", options: ["to start", "starting", "start", "to starting"], answer: "to start", why: "Plan + to + инфинитив." },
    { id: "cmp-6", q: "The new model ___ to be released in May.", options: ["is due", "is aiming", "is expecting", "is hoping"], answer: "is due", why: "Be due to: ожидается по плану." },
    { id: "cmp-7", q: "I've ___ to meet Anna at six.", options: ["arranged", "intended", "hoped", "planned out"], answer: "arranged", why: "Arrange to + инфинитив: договорился." },
    { id: "cmp-8", q: "I ___ to apply for the job, but I changed my mind.", options: ["was going", "am going", "will", "had been going"], answer: "was going", why: "Was going to: намерение, которое не осуществилось." },
    { id: "cmp-9", q: "Prices have risen ___ in the last year.", options: ["dramatically", "dramatic", "more dramatic", "a lot dramatic"], answer: "dramatically", why: "Глагол определяет наречие." },
    { id: "cmp-10", q: "My new flat isn't ___ as big as my old one.", options: ["nearly", "nearer", "near", "nearest"], answer: "nearly", why: "Not nearly as … as: гораздо меньше." },
    { id: "cmp-11", q: "She's twice ___ old as me.", answer: "as", why: "Twice as … as." },
    { id: "cmp-12", q: "He's the ___ person I know.", options: ["more stubborn", "most stubborn", "stubbornest", "stubborner"], answer: "most stubborn", why: "Длинные прилагательные: the most + прилагательное." },
  ],
};

export const NOUN_HAVE_DRILL: Drill = {
  id: "noun-have-get",
  title: "Именные группы и конструкции have / get",
  tag: "Empower Unit 4A–4B",
  rule: [
    "Порядок определений: мнение — размер — возраст — форма — цвет — происхождение — материал: a lovely old round wooden table. Наречия с -ly (highly acclaimed) не требуют дефиса. Часто используют «the fact that …» и существительные вместо глаголов (installation вместо install).",
    "Have / get something done: что-то делают для вас (I had my hair cut). Get something done — разговорнее и подчёркивает усилие. Have someone do (без to) / get someone to do (с to): заставить, договориться. Get + V3 — со мной случилось (He got fined).",
  ],
  examples: [
    "I need to get my car serviced.",
    "She had her bag stolen on the train.",
    "He got fined for speeding.",
    "A beautiful old round wooden table.",
  ],
  items: [
    { id: "nhg-1", q: "I need to get my car ___ before the trip.", options: ["service", "serviced", "servicing", "to service"], answer: "serviced", why: "Get + дополнение + V3: сделать автомобиль обслуженным." },
    { id: "nhg-2", q: "She had her bag ___ on the train.", options: ["steal", "stolen", "stealing", "to steal"], answer: "stolen", why: "Have + объект + V3: у неё украли (событие произошло с ней)." },
    { id: "nhg-3", q: "I couldn't get the printer ___.", options: ["to work", "work", "worked", "works"], answer: "to work", why: "Get + объект + to + инфинитив: заставить работать." },
    { id: "nhg-4", q: "The boss had us ___ overtime all week.", options: ["to work", "work", "worked", "to working"], answer: "work", why: "Have + кто-то + инфинитив без to." },
    { id: "nhg-5", q: "He got ___ for speeding.", options: ["fine", "fined", "fining", "to fine"], answer: "fined", why: "Get + V3: с ним случилось." },
    { id: "nhg-6", q: "She bought a ___ table.", options: ["wooden round old", "old round wooden", "round old wooden", "wooden old round"], answer: "old round wooden", why: "Порядок: возраст — форма — материал." },
    { id: "nhg-7", q: "The fact ___ he lied surprised nobody.", options: ["what", "that", "which", "of"], answer: "that", why: "The fact that + придаточное." },
    { id: "nhg-8", q: "The ___ of the new software was delayed.", options: ["install", "installation", "installer", "installed"], answer: "installation", why: "Существительное вместо глагола (номинализация)." },
    { id: "nhg-9", q: "It was a ___ novel.", options: ["highly acclaimed", "high acclaimed", "highly acclaiming", "high-acclaimed"], answer: "highly acclaimed", why: "Наречие на -ly + причастие, без дефиса." },
    { id: "nhg-10", q: "Having the roof ___ cost us a fortune.", options: ["repaired", "repair", "repairing", "to repair"], answer: "repaired", why: "Have + объект + V3." },
    { id: "nhg-11", q: "We must get the report ___ (finish) by Friday.", answer: "finished", why: "Get + объект + V3." },
    { id: "nhg-12", q: "I'll have the waiter ___ the table.", options: ["to clear", "clear", "cleared", "clearing"], answer: "clear", why: "Have + кто-то + инфинитив без to." },
  ],
};

export const RELATIVE_DRILL: Drill = {
  id: "relative-obligation",
  title: "Относительные придаточные и долженствование",
  tag: "Empower Unit 5A–5B",
  rule: [
    "Определяющие придаточные (defining) нужны для смысла, без запятых, возможен that. В пояснительных (non-defining) — запятые, that нельзя: My brother, who lives in Canada, is visiting. Which может относиться ко всему предложению: She gave me advice, which was very helpful. После предлога в формальной речи — whom / which: the people with whom I work.",
    "Долженствование: must / have to / need to; mustn't — нельзя; don't have to / needn't — не нужно; be allowed to / be permitted to — разрешено; be required to / be obliged to — обязан; be supposed to — ожидается (но не всегда выполняется); had better — «лучше бы».",
  ],
  examples: [
    "The woman whose car was stolen called the police.",
    "That's the house in which I grew up.",
    "You mustn't park here. You don't have to wear a tie.",
    "Visitors are required to show their passports.",
  ],
  items: [
    { id: "rel-1", q: "The woman ___ car was stolen called the police.", options: ["who", "whose", "which", "whom"], answer: "whose", why: "Whose выражает принадлежность." },
    { id: "rel-2", q: "That's the house in ___ I grew up.", options: ["that", "which", "where", "what"], answer: "which", why: "Предлог + which: in which." },
    { id: "rel-3", q: "My brother, ___ lives in Canada, is visiting.", options: ["that", "who", "whom", "which"], answer: "who", why: "Пояснительное придаточное — that нельзя." },
    { id: "rel-4", q: "She gave me some advice, ___ was very helpful.", options: ["that", "what", "which", "who"], answer: "which", why: "Which относится ко всему сказанному, запятая обязательна." },
    { id: "rel-5", q: "The people with ___ I work are great.", options: ["who", "whom", "which", "that"], answer: "whom", why: "После предлога в формальной речи: whom." },
    { id: "rel-6", q: "You ___ park here; it's reserved for staff.", options: ["mustn't", "needn't", "don't have to", "haven't"], answer: "mustn't", why: "Mustn't — запрет." },
    { id: "rel-7", q: "You ___ wear a tie, but you can if you like.", options: ["mustn't", "don't have to", "can't", "shouldn't"], answer: "don't have to", why: "Don't have to — не обязательно." },
    { id: "rel-8", q: "Visitors are required ___ their passports.", options: ["showing", "to show", "show", "to showing"], answer: "to show", why: "Be required + to + инфинитив." },
    { id: "rel-9", q: "We ___ leave before ten; the room is booked.", options: ["are obliged to", "can", "needn't", "may"], answer: "are obliged to", why: "Обязаны по обстоятельствам." },
    { id: "rel-10", q: "Employees ___ to use personal phones during working hours.", options: ["aren't allowed", "don't allow", "aren't permit", "haven't allowed"], answer: "aren't allowed", why: "Be allowed to — пассивная конструкция." },
    { id: "rel-11", q: "Everything ___ he said was true.", answer: "that", why: "После everything / all / something используют that." },
    { id: "rel-12", q: "You'd ___ hurry up; the bus leaves soon.", answer: "better", why: "Had better + инфинитив: совет с угрозой последствий." },
  ],
};

export const CONTINUOUS_DRILL: Drill = {
  id: "continuous-participle",
  title: "Простое и длительное время; причастные обороты",
  tag: "Empower Unit 6A–6B",
  rule: [
    "Глаголы состояния (know, believe, love, belong, want, have = «иметь») не употребляют в Continuous. Но многие глаголы меняют значение: I think it's good (мнение) — I'm thinking about it (процесс); He is unreasonable (всегда) — He is being unreasonable (сейчас ведёт себя так). Always + Continuous — раздражающая привычка: She is always leaving the lights on.",
    "Причастные обороты сокращают придаточные. Действующее лицо: Looking at the photo, I noticed… Страдательное: Disturbed by the noise, she couldn't sleep. Предшествовавшее: Having finished the report, he went home. Отрицание: Not knowing what to say, he kept quiet.",
  ],
  examples: [
    "He is being unreasonable.",
    "Looking at the photo, I noticed a stranger.",
    "Having finished the report, he went home.",
  ],
  items: [
    { id: "cp-1", q: "I ___ this soup tastes strange.", options: ["am thinking", "think", "have thought", "thinking"], answer: "think", why: "Think в значении «полагаю» — состояние, без Continuous." },
    { id: "cp-2", q: "He ___ unreasonable at the moment.", options: ["is being", "is", "being", "has been"], answer: "is being", why: "Be being: ведёт себя так в данный момент." },
    { id: "cp-3", q: "I ___ this camera for years.", options: ["am having", "have had", "have", "had having"], answer: "have had", why: "Have = «иметь» — не Continuous; for years → Present Perfect." },
    { id: "cp-4", q: "___ at the photo, I noticed a stranger.", options: ["Looked", "Looking", "To look", "Look"], answer: "Looking", why: "Действие одного лица: причастие настоящего." },
    { id: "cp-5", q: "___ by the noise, she couldn't sleep.", options: ["Disturbed", "Disturbing", "Being disturb", "To disturb"], answer: "Disturbed", why: "Страдательное значение: причастие прошедшего." },
    { id: "cp-6", q: "The man ___ at the window is my uncle.", options: ["stands", "standing", "stood", "to stand"], answer: "standing", why: "Сокращение определительного придаточного." },
    { id: "cp-7", q: "___ finished the report, he went home.", options: ["Having", "Be", "To have", "Had"], answer: "Having", why: "Having + V3: действие раньше." },
    { id: "cp-8", q: "She is always ___ about her neighbours.", options: ["complaining", "complains", "to complain", "complained"], answer: "complaining", why: "Always + Continuous: раздражающая привычка." },
    { id: "cp-9", q: "The film ___ at eight, so we should leave soon.", options: ["starts", "is starting", "start", "will starts"], answer: "starts", why: "Расписание: Present Simple." },
    { id: "cp-10", q: "___ (not / know) what to say, he kept quiet.", answer: "Not knowing", why: "Отрицание ставится перед причастием." },
    { id: "cp-11", q: "She ___ (always / leave) the lights on!", answer: "is always leaving", why: "Always + Continuous — раздражение." },
    { id: "cp-12", q: "The book ___ (write) in 1990 has become a classic.", answer: "written", why: "Причастие прошедшего в определительном обороте." },
  ],
};

export const CLEFT_DRILL: Drill = {
  id: "cleft",
  title: "Расщеплённые предложения (cleft)",
  tag: "Empower Unit 7B",
  rule: [
    "Cleft-предложения выносят главное вперёд. It-cleft: It was Anna who called. It was in 1969 that man walked on the moon. Wh-cleft: What I need is a long holiday. What annoys me is the noise. All I want is a quiet life. The reason I'm calling is to apologise. The thing that worries me is the cost.",
    "После What-части глагол be: is / was. Если часть What … действие, после be идёт инфинитив с to или без: What she did was call the police.",
  ],
  examples: [
    "What I need is a long holiday.",
    "It was Anna who called.",
    "All I want is a quiet life.",
  ],
  items: [
    { id: "cl-1", q: "___ I need is a long holiday.", options: ["What", "That", "Which", "It"], answer: "What", why: "What-cleft: What I need is …" },
    { id: "cl-2", q: "___ was Anna who called.", options: ["It", "That", "There", "This"], answer: "It", why: "It-cleft: It was … who …" },
    { id: "cl-3", q: "What annoys me ___ the noise.", options: ["is", "are", "it is", "that"], answer: "is", why: "После What-части идёт is." },
    { id: "cl-4", q: "All I want ___ a quiet life.", options: ["is", "are", "to be", "for"], answer: "is", why: "All I want is …" },
    { id: "cl-5", q: "What she did ___ call the police.", options: ["was", "did", "has", "to"], answer: "was", why: "What she did was + инфинитив." },
    { id: "cl-6", q: "It's the noise ___ drives me mad.", options: ["what", "that", "who", "whom"], answer: "that", why: "It's … that … выделяет подлежащее-предмет." },
    { id: "cl-7", q: "It was in 1969 ___ man first walked on the moon.", options: ["that", "when", "which", "what"], answer: "that", why: "It was + время + that." },
    { id: "cl-8", q: "What I like most about him ___ his sense of humour.", options: ["is", "are", "it is", "does"], answer: "is", why: "What … is …" },
    { id: "cl-9", q: "The thing ___ worries me is the cost.", options: ["what", "that", "who", "whose"], answer: "that", why: "The thing that …" },
    { id: "cl-10", q: "It was my brother ___ broke the window.", answer: "who|that", why: "It-cleft с человеком: who или that." },
    { id: "cl-11", q: "___ (what) surprised me was her attitude.", answer: "What", why: "What-cleft." },
    { id: "cl-12", q: "It's not the money ___ I'm worried about.", options: ["what", "that", "which", "where"], answer: "that", why: "It's not … that …" },
  ],
};
