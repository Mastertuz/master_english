/**
 * Дополнительные материалы к разбору ОГЭ: фразы для письма, темы
 * монологов из открытого банка ФИПИ, идеи для темы «Родная страна»,
 * лексика по темам и слова-ловушки.
 *
 * Темы и структура — по материалам Алины Максимовой (Умскул), которые
 * прислал преподаватель; подборка слов, примеры и пояснения — собственные.
 * Планы монологов — задания открытого банка ФИПИ.
 */

export type Phrase = { en: string; ru: string };

/* ───────────────────────────── Письмо (35) ───────────────────────────── */

export const letterPhrases: { part: string; note: string; phrases: Phrase[] }[] = [
  {
    part: "Обращение",
    note: "Отдельной строкой, после имени — запятая. Имя берите из письма-стимула.",
    phrases: [
      { en: "Dear Tom,", ru: "Дорогой Том," },
      { en: "Hi Tom,", ru: "Привет, Том," },
      { en: "Hello Tom,", ru: "Здравствуй, Том," },
    ],
  },
  {
    part: "Благодарность за письмо",
    note: "С новой строки, сразу после обращения.",
    phrases: [
      { en: "Thanks for your recent email.", ru: "Спасибо за твоё недавнее письмо." },
      { en: "Thank you for writing to me.", ru: "Спасибо, что написал(а) мне." },
      { en: "It was great to hear from you!", ru: "Было здорово получить от тебя весточку!" },
      { en: "I'm always glad to get your messages.", ru: "Я всегда рад(а) твоим письмам." },
    ],
  },
  {
    part: "Переход к ответам на вопросы",
    note: "Дальше — три полных ответа, лучше с причинами.",
    phrases: [
      { en: "You asked me about … Well, …", ru: "Ты спрашивал(а) меня о … Так вот, …" },
      { en: "In your email you asked me some questions. Here are my answers.", ru: "В письме ты задал(а) мне несколько вопросов. Вот мои ответы." },
      { en: "As for your question about …, …", ru: "Что касается твоего вопроса о …, …" },
      { en: "I'd be happy to tell you about …", ru: "С радостью расскажу тебе о …" },
    ],
  },
  {
    part: "Завершение и надежда на контакт",
    note: "Отдельным абзацем перед завершающей фразой.",
    phrases: [
      { en: "That's all for now. / Sorry, I have to go now.", ru: "Пока это всё. / Извини, мне пора." },
      { en: "Write back soon.", ru: "Напиши скорее." },
      { en: "Hope to hear from you soon.", ru: "Надеюсь скоро получить ответ." },
      { en: "Drop me a line.", ru: "Черкни мне пару строк." },
      { en: "I'm looking forward to your reply.", ru: "Жду твоего ответа." },
    ],
  },
  {
    part: "Завершающая фраза",
    note: "Отдельной строкой, после неё — запятая.",
    phrases: [
      { en: "Best wishes,", ru: "С наилучшими пожеланиями," },
      { en: "All the best,", ru: "Всего наилучшего," },
      { en: "Take care,", ru: "Береги себя," },
      { en: "Love,", ru: "С любовью," },
    ],
  },
  {
    part: "Подпись",
    note: "Только имя, отдельной строкой, без точки и без фамилии.",
    phrases: [{ en: "Anna", ru: "Анна" }],
  },
];

export const linkingWords: { group: string; words: Phrase[] }[] = [
  {
    group: "Мнение",
    words: [
      { en: "In my opinion / In my view", ru: "по-моему" },
      { en: "Personally, I think that…", ru: "лично я думаю, что…" },
      { en: "As for me", ru: "что касается меня" },
      { en: "It seems to me that…", ru: "мне кажется, что…" },
    ],
  },
  {
    group: "Добавление",
    words: [
      { en: "Besides", ru: "кроме того" },
      { en: "Moreover / In addition", ru: "более того / вдобавок" },
      { en: "Also", ru: "также" },
    ],
  },
  {
    group: "Противопоставление",
    words: [
      { en: "However", ru: "однако" },
      { en: "Although", ru: "хотя" },
      { en: "Despite / In spite of", ru: "несмотря на" },
      { en: "On the other hand", ru: "с другой стороны" },
    ],
  },
  {
    group: "Пример",
    words: [
      { en: "For example / For instance", ru: "например" },
      { en: "such as", ru: "такие как" },
    ],
  },
  {
    group: "Причина и следствие",
    words: [
      { en: "because / as", ru: "потому что / так как" },
      { en: "so / that's why", ru: "поэтому" },
      { en: "due to", ru: "из-за" },
    ],
  },
  {
    group: "Оживить текст",
    words: [
      { en: "By the way", ru: "кстати" },
      { en: "Actually", ru: "на самом деле" },
      { en: "Fortunately / Unfortunately", ru: "к счастью / к сожалению" },
      { en: "To my surprise", ru: "к моему удивлению" },
    ],
  },
];

/* ─────────────────────── Монологи: банк ФИПИ ─────────────────────── */

export const monologueInstruction =
  "You are going to give a talk about … You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences). Remember to say:";

export const monologueBank: { topic: string; talks: { about: string; points: string[] }[] }[] = [
  {
    topic: "Школа",
    talks: [
      { about: "your school", points: ["what your typical school day is like", "what your favourite subject is, and why", "what you like most about your school", "what your attitude to your school life is"] },
      { about: "your school", points: ["what your typical school day is like", "what subjects at school you find most useful for your future, and why", "what you are going to do when you leave school", "what your attitude to school life is"] },
      { about: "your school", points: ["what you like most about your school", "what weekday you find the most difficult, and why", "what you would like to change in your school life", "what your attitude to your school life is"] },
      { about: "your school", points: ["what you like about your school most of all", "how many lessons a day you usually have", "what school subjects you have chosen for your exams, and why", "what your attitude to the number of subjects you have to learn is"] },
      { about: "school life", points: ["what your weekday is like", "what you like about your school most of all", "whether you prefer classroom learning or online learning, and why", "what your attitude to your school life is"] },
      { about: "school homework", points: ["how long it takes you to do your homework", "what subject you usually start with, and why", "whether schoolchildren should be given more or less homework, and why", "what your attitude to school homework is"] },
      { about: "your school holidays", points: ["when you have school holidays", "what school holidays you would make longer, and why", "what you enjoy doing during your school holidays", "what your attitude to school holidays is"] },
    ],
  },
  {
    topic: "Путешествия",
    talks: [
      { about: "travelling", points: ["why people like travelling in Russia", "what means of transport is the most popular for travelling in Russia, and why", "what places in Russia you would like to visit", "what your attitude to travelling is"] },
      { about: "travelling", points: ["why most people enjoy travelling", "what people like doing while travelling", "what place you would like to go to, and why", "what your attitude to travelling is"] },
      { about: "travelling", points: ["why most people like travelling", "which season is the best for travelling in your opinion", "what means of transport is the best for travelling, and why", "what your attitude to travelling is"] },
    ],
  },
  {
    topic: "Спорт и здоровье",
    talks: [
      { about: "sports", points: ["why a lot of young people do sports nowadays", "what sports clubs and teams there are in your school", "what you do to keep fit", "what your attitude to doing sports activities is"] },
      { about: "keeping fit", points: ["why doing sport is very important for modern teenagers", "what else besides sport young people do to keep fit", "what you enjoy doing in your free time", "what your attitude to doing sports activities is"] },
      { about: "keeping fit", points: ["why a healthy lifestyle is popular nowadays", "what you do to keep fit", "what sports activities are popular with teenagers in your region", "what your attitude to a healthy lifestyle is"] },
    ],
  },
  {
    topic: "Чтение",
    talks: [
      { about: "reading books", points: ["whether reading is popular with teenagers, and why, or why not", "what kind of books you like reading", "why many people prefer e-books to paper books", "what your attitude to reading is"] },
    ],
  },
  {
    topic: "Животные",
    talks: [
      { about: "animals", points: ["what wild animals live in your region", "whether it is a good idea to keep a wild animal as a pet, and why", "why people build zoos in cities and towns", "what your attitude to zoos is"] },
    ],
  },
  {
    topic: "Кино и телевидение",
    talks: [
      { about: "films", points: ["what kinds of films modern teenagers enjoy", "where you prefer watching films: on TV, on the Internet or in the cinema, and why", "what film you have seen recently, what it was about", "what your attitude to watching films as a way to spend your free time is"] },
      { about: "TV", points: ["why people spend time watching TV", "what most teenagers prefer: watching TV or browsing the Internet, and why", "whether there is a TV programme you really like", "what your attitude to watching TV as a way to spend your free time is"] },
      { about: "TV", points: ["whether watching TV is a popular pastime with teenagers, and why, or why not", "how many hours a week you watch TV", "what TV programme is the most popular within your family", "what your attitude to TV is"] },
    ],
  },
  {
    topic: "Экология",
    talks: [
      { about: "environmental problems", points: ["why people worry about environmental problems nowadays", "what the most serious environmental problem in the place where you live is", "what young people can do to improve the ecological situation", "what your attitude to environmental problems is"] },
    ],
  },
  {
    topic: "Свободное время и хобби",
    talks: [
      { about: "your free time", points: ["whether you have a lot of free time, and why, or why not", "what you enjoy doing in your free time", "what your Sunday afternoons are like", "what your attitude to planning your free time is"] },
      { about: "hobbies", points: ["why it is important for people to have a hobby", "what your hobby is and how long you have been doing it", "how much time a week you give to your hobby and why", "what your attitude to creative hobbies is"] },
    ],
  },
  {
    topic: "Иностранные языки",
    talks: [
      { about: "learning foreign languages", points: ["why lots of people learn foreign languages nowadays", "why you have chosen to do the English exam this year", "what you did to prepare for your English exam", "what your attitude to learning foreign languages is"] },
    ],
  },
  {
    topic: "Интернет",
    talks: [
      { about: "the Internet", points: ["why today's teenagers use the Internet so much", "how the Internet makes long-distance communication easier", "what dangers teenagers can face when they use the Internet", "what your attitude to the Internet is"] },
    ],
  },
  {
    topic: "Семья и друзья",
    talks: [
      { about: "family", points: ["why family plays an important role in every person's life", "what a typical Russian family is like", "who you feel closest to in your family and why", "what your attitude to having a big family is"] },
      { about: "conflicts with your friends", points: ["why teenagers can have a conflict with their friends", "what you usually have conflicts with your friends about", "how you usually make up with your friends", "what your attitude to conflicts with your friends is"] },
      { about: "your best friend", points: ["what people need friends for", "how long you and your friend have known each other", "what you enjoy doing together", "what your attitude to friendship is"] },
    ],
  },
  {
    topic: "Покупки и деньги",
    talks: [
      { about: "shopping", points: ["why many people enjoy shopping", "who you like shopping with and why", "what you like and dislike shopping for", "what your attitude to online shopping is"] },
      { about: "pocket money", points: ["why it is important for a teenager to have pocket money", "how much pocket money a week you usually get", "what you spend your pocket money on and why", "what your attitude to earning pocket money is"] },
    ],
  },
  {
    topic: "Дом и место, где ты живёшь",
    talks: [
      { about: "household chores", points: ["why it is important to share the household chores in a family", "how household chores are divided in your family", "what household chores you like and dislike doing and why", "what your attitude to ignoring household chores is"] },
      { about: "the place where you live", points: ["what your city, town or village is famous for", "what your favourite place in your city, town or village is, and why you like it", "whether you are going to stay in your city, town or village after leaving school or move to another place, and why", "what your attitude to your city, town or village is"] },
    ],
  },
];

/* ─────────────────────── Родная страна: идеи ─────────────────────── */

export const homelandIdeas: { title: string; items: string[] }[] = [
  {
    title: "Куда поехать",
    items: [
      "Moscow — Red Square, the Kremlin, St Basil's Cathedral",
      "Saint Petersburg — the Hermitage, Peterhof, the drawbridges on the Neva",
      "Kazan — the Kazan Kremlin",
      "The Golden Ring towns — Suzdal, Vladimir, Yaroslavl",
      "Lake Baikal — the deepest lake in the world",
      "Kamchatka — volcanoes and geysers",
      "The Trans-Siberian Railway — the longest railway in the world",
    ],
  },
  {
    title: "Праздники",
    items: ["New Year and Christmas holidays", "Maslenitsa (Pancake Week)", "Defender of the Fatherland Day", "International Women's Day", "Victory Day", "Russia Day", "Mother's Day"],
  },
  {
    title: "Национальная кухня",
    items: [
      "borscht — beetroot soup with cabbage, potatoes and meat",
      "pelmeni — small dumplings with meat",
      "blini — thin pancakes with jam, honey or sour cream",
      "shchi — cabbage soup",
      "syrniki — cottage cheese pancakes",
    ],
  },
  {
    title: "Писатели",
    items: [
      "Alexander Pushkin — Eugene Onegin",
      "Leo Tolstoy — War and Peace",
      "Fyodor Dostoevsky — Crime and Punishment",
      "Anton Chekhov — The Cherry Orchard",
      "Mikhail Bulgakov — The Master and Margarita",
    ],
  },
  {
    title: "Музыка и живопись",
    items: [
      "Pyotr Tchaikovsky — Swan Lake, The Nutcracker",
      "Sergei Rachmaninoff — music for the piano",
      "Ivan Aivazovsky — The Ninth Wave",
      "Ivan Shishkin — Morning in a Pine Forest",
      "Ilya Repin — Barge Haulers on the Volga",
    ],
  },
  {
    title: "Учёные и история",
    items: [
      "Mikhail Lomonosov — founded Moscow University",
      "Dmitri Mendeleev — the periodic table",
      "Alexander Popov — one of the inventors of the radio",
      "Sergei Korolev — space rockets",
      "Peter the Great — founded Saint Petersburg",
      "Yuri Gagarin — the first man in space (1961)",
      "Valentina Tereshkova — the first woman in space (1963)",
    ],
  },
  {
    title: "Спорт",
    items: ["Alexander Ovechkin — ice hockey", "Maria Sharapova — tennis", "Alina Zagitova — figure skating"],
  },
  {
    title: "Готовые фразы для ответа",
    items: [
      "Russia is the largest country in the world, so there are a lot of places to see.",
      "If you come to Russia, you should definitely visit …",
      "… is famous for its …",
      "One of the most popular holidays in my country is …",
      "Every foreign tourist should try …",
    ],
  },
];

/* ─────────────────────────── Лексика по темам ─────────────────────────── */

export const vocabularyTopics: { topic: string; words: Phrase[]; families: string[] }[] = [
  {
    topic: "Семья и друзья",
    words: [
      { en: "relative", ru: "родственник" },
      { en: "generation", ru: "поколение" },
      { en: "household chores", ru: "домашние обязанности" },
      { en: "get on (well) with", ru: "ладить с" },
      { en: "fall out with / make up", ru: "поссориться с / помириться" },
      { en: "look after", ru: "присматривать, заботиться" },
      { en: "take after", ru: "быть похожим на родителя" },
      { en: "have a lot in common", ru: "иметь много общего" },
      { en: "keep in touch", ru: "поддерживать связь" },
    ],
    families: ["friend — friendly — unfriendly — friendship", "relate — relative — relationship", "responsible — irresponsible — responsibility"],
  },
  {
    topic: "Внешность и характер",
    words: [
      { en: "appearance", ru: "внешность" },
      { en: "well-built / slim", ru: "крепкого телосложения / стройный" },
      { en: "curly / straight hair", ru: "кудрявые / прямые волосы" },
      { en: "generous", ru: "щедрый" },
      { en: "reliable", ru: "надёжный" },
      { en: "sociable / shy", ru: "общительный / застенчивый" },
      { en: "sense of humour", ru: "чувство юмора" },
    ],
    families: ["patience — patient — impatient — patiently", "honesty — honest — dishonest", "confidence — confident — confidently", "ambition — ambitious"],
  },
  {
    topic: "Досуг и увлечения",
    words: [
      { en: "take up (a hobby)", ru: "начать заниматься" },
      { en: "be keen on / be fond of", ru: "увлекаться / любить" },
      { en: "spare time", ru: "свободное время" },
      { en: "exhibition", ru: "выставка" },
      { en: "plot / genre", ru: "сюжет / жанр" },
      { en: "entertaining", ru: "развлекательный" },
    ],
    families: ["entertain — entertainment — entertaining", "imagine — imagination — imaginative", "compete — competition — competitive — competitor", "perform — performance — performer"],
  },
  {
    topic: "Здоровый образ жизни",
    words: [
      { en: "healthy lifestyle", ru: "здоровый образ жизни" },
      { en: "balanced diet", ru: "сбалансированное питание" },
      { en: "junk food", ru: "вредная еда" },
      { en: "keep fit / work out", ru: "поддерживать форму / тренироваться" },
      { en: "cut down on", ru: "сократить потребление" },
      { en: "get over (an illness)", ru: "выздороветь" },
      { en: "harmful / beneficial", ru: "вредный / полезный" },
    ],
    families: ["health — healthy — unhealthy — healthily", "fit — fitness — unfit", "nutrition — nutritious", "advice (сущ.) — advise (гл.)"],
  },
  {
    topic: "Покупки и карманные деньги",
    words: [
      { en: "pocket money", ru: "карманные деньги" },
      { en: "discount / sale", ru: "скидка / распродажа" },
      { en: "bargain", ru: "выгодная покупка" },
      { en: "try on", ru: "примерять" },
      { en: "afford", ru: "позволить себе" },
      { en: "save up", ru: "копить" },
      { en: "second-hand", ru: "подержанный" },
    ],
    families: ["fashion — fashionable — unfashionable", "afford — affordable — unaffordable", "expense — expensive — inexpensive", "comfort — comfortable — uncomfortable"],
  },
  {
    topic: "Школа",
    words: [
      { en: "timetable", ru: "расписание" },
      { en: "compulsory / optional", ru: "обязательный / по выбору" },
      { en: "revise", ru: "повторять материал" },
      { en: "pass / fail an exam", ru: "сдать / провалить экзамен" },
      { en: "fall behind / catch up with", ru: "отстать / догнать" },
      { en: "hand in (homework)", ru: "сдать (домашнюю работу)" },
      { en: "after-school clubs", ru: "кружки после уроков" },
    ],
    families: ["educate — education — educational", "achieve — achievement — achievable", "succeed — success — successful — successfully", "behave — behaviour — misbehave"],
  },
  {
    topic: "Мир профессий",
    words: [
      { en: "career", ru: "карьера" },
      { en: "salary", ru: "зарплата" },
      { en: "part-time / full-time job", ru: "работа неполный / полный день" },
      { en: "apply for (a job)", ru: "подать заявку" },
      { en: "job interview", ru: "собеседование" },
      { en: "well-paid / rewarding", ru: "высокооплачиваемый / приносящий удовлетворение" },
      { en: "unemployment", ru: "безработица" },
    ],
    families: ["employ — employer — employee — employment — unemployed", "profession — professional — professionally", "qualify — qualification — qualified", "retire — retirement"],
  },
  {
    topic: "Отдых и путешествия",
    words: [
      { en: "destination", ru: "место назначения" },
      { en: "accommodation", ru: "жильё" },
      { en: "sightseeing / landmark", ru: "осмотр достопримечательностей / достопримечательность" },
      { en: "luggage", ru: "багаж" },
      { en: "set off", ru: "отправиться в путь" },
      { en: "book a hotel", ru: "забронировать отель" },
      { en: "picturesque", ru: "живописный" },
    ],
    families: ["travel — traveller", "arrive — arrival; depart — departure", "tour — tourist — tourism", "explore — explorer — exploration"],
  },
  {
    topic: "Город и сельская местность",
    words: [
      { en: "countryside / suburb", ru: "сельская местность / пригород" },
      { en: "facilities", ru: "удобства, инфраструктура" },
      { en: "traffic jam", ru: "пробка" },
      { en: "cost of living", ru: "стоимость жизни" },
      { en: "public transport", ru: "общественный транспорт" },
      { en: "lively / peaceful", ru: "оживлённый / спокойный" },
      { en: "get around", ru: "передвигаться" },
    ],
    families: ["pollute — pollution — polluted", "convenience — convenient — inconvenient", "develop — development — developed", "neighbour — neighbourhood"],
  },
  {
    topic: "Природа и экология",
    words: [
      { en: "environment", ru: "окружающая среда" },
      { en: "endangered species", ru: "вымирающие виды" },
      { en: "recycling", ru: "переработка" },
      { en: "renewable energy", ru: "возобновляемая энергия" },
      { en: "global warming", ru: "глобальное потепление" },
      { en: "die out", ru: "вымирать" },
      { en: "cut down trees", ru: "вырубать деревья" },
    ],
    families: ["environment — environmental — environmentally", "protect — protection — protective", "destroy — destruction — destructive", "nature — natural — unnatural"],
  },
  {
    topic: "СМИ и интернет",
    words: [
      { en: "social media", ru: "соцсети" },
      { en: "advertisement", ru: "реклама" },
      { en: "reliable source", ru: "надёжный источник" },
      { en: "fake news", ru: "фейковые новости" },
      { en: "subscribe to", ru: "подписаться на" },
      { en: "browse the Internet", ru: "просматривать интернет" },
      { en: "addictive", ru: "вызывающий зависимость" },
    ],
    families: ["inform — information — informative", "publish — publication — publisher", "advertise — advertisement — advertiser", "influence — influential — influencer"],
  },
  {
    topic: "Родная страна и страна изучаемого языка",
    words: [
      { en: "landmark", ru: "достопримечательность" },
      { en: "custom / tradition", ru: "обычай / традиция" },
      { en: "public holiday", ru: "государственный праздник" },
      { en: "cuisine", ru: "кухня (национальная)" },
      { en: "heritage", ru: "наследие" },
      { en: "be famous for", ru: "славиться" },
      { en: "hand down (traditions)", ru: "передавать из поколения в поколение" },
    ],
    families: ["nation — national — international — nationality", "culture — cultural — multicultural", "history — historical — historian", "tradition — traditional — traditionally"],
  },
  {
    topic: "Выдающиеся люди",
    words: [
      { en: "achievement", ru: "достижение" },
      { en: "contribution", ru: "вклад" },
      { en: "invention / discovery", ru: "изобретение / открытие" },
      { en: "masterpiece", ru: "шедевр" },
      { en: "outstanding", ru: "выдающийся" },
      { en: "go down in history", ru: "войти в историю" },
      { en: "come up with (an idea)", ru: "придумать" },
    ],
    families: ["science — scientist — scientific", "invent — inventor — invention", "discover — discovery — discoverer", "contribute — contribution"],
  },
];

/** Суффиксы и приставки — шпаргалка к заданиям 29–34 */
export const affixes: { part: string; items: string[] }[] = [
  { part: "Существительное", items: ["-tion / -ation: inform → information", "-ment: develop → development", "-ness: kind → kindness", "-ity: popular → popularity", "-ance / -ence: appear → appearance", "-er / -or / -ist: teach → teacher, science → scientist", "-ship: friend → friendship"] },
  { part: "Прилагательное", items: ["-ful: help → helpful", "-less: harm → harmless", "-ous: danger → dangerous", "-al: nature → natural", "-ive: create → creative", "-able / -ible: afford → affordable", "-y: sun → sunny", "-ic: science → scientific"] },
  { part: "Наречие", items: ["-ly: careful → carefully, happy → happily"] },
  { part: "Отрицание", items: ["un-: unhappy", "in- / im- / il- / ir-: independent, impossible, illegal, irresponsible", "dis-: dishonest", "mis-: misunderstand"] },
];

/* ─────────────────────────── Слова-ловушки ─────────────────────────── */

export const trapWords: { pair: string; rule: string; examples: string[] }[] = [
  { pair: "look / watch / see", rule: "look (at) — смотреть намеренно на что-то неподвижное; watch — следить за движением, процессом; see — видеть, замечать без усилия.", examples: ["Look at this photo.", "We watched a football match.", "I saw Kate at the station."] },
  { pair: "listen / hear", rule: "listen (to) — слушать намеренно; hear — слышать.", examples: ["I like listening to podcasts.", "Did you hear the thunder?"] },
  { pair: "say / tell", rule: "tell — всегда кому-то: tell me, tell him; say — просто сказать (say to me — если адресат нужен).", examples: ["He told me the news.", "She said that she was busy."] },
  { pair: "speak / talk", rule: "speak — говорить на языке, выступать, более официально; talk — разговаривать, болтать.", examples: ["Do you speak French?", "We talked for hours."] },
  { pair: "make / do", rule: "make — создать, приготовить, сделать что-то новое; do — выполнить работу, действие.", examples: ["make a cake, make a decision, make friends", "do homework, do sport, do your best"] },
  { pair: "bring / take", rule: "bring — принести сюда, к говорящему; take — унести, взять с собой туда.", examples: ["Bring your notebook to the lesson.", "Take an umbrella with you."] },
  { pair: "since / for", rule: "since — с момента (since 2020, since Monday); for — в течение (for two years).", examples: ["I have known him since 2019.", "I have known him for five years."] },
  { pair: "already / yet / still", rule: "already — уже (в утверждении); yet — уже? / ещё не (в вопросе и отрицании); still — всё ещё.", examples: ["I've already finished.", "Have you finished yet? I haven't finished yet.", "She is still asleep."] },
  { pair: "used to / be used to", rule: "used to + V — раньше (а теперь нет); be used to + Ving — привык.", examples: ["I used to live in Omsk.", "I'm used to getting up early."] },
  { pair: "bored / boring (и другие -ed / -ing)", rule: "-ed — что чувствует человек; -ing — какой предмет или ситуация.", examples: ["The lecture was boring, so I felt bored.", "She is interested in art. Art is interesting."] },
  { pair: "few / a few, little / a little", rule: "few / little — мало, почти нет (грустно); a few / a little — немного, но есть. Few — с исчисляемыми, little — с неисчисляемыми.", examples: ["I have a few good friends.", "There is little milk left — we need to buy some."] },
  { pair: "much / many / a lot of", rule: "many — с исчисляемыми, much — с неисчисляемыми (чаще в вопросах и отрицаниях), a lot of — с любыми в утверждении.", examples: ["How many books?", "I don't have much time.", "She has a lot of friends."] },
  { pair: "in / on / at (время)", rule: "in — месяц, год, время года; on — день, дата; at — точное время, праздник, выходные (at the weekend).", examples: ["in May, in 2010", "on Friday, on 5th June", "at 7 o'clock, at Christmas"] },
  { pair: "in / on / at (место)", rule: "in — внутри, в городе или стране; on — на поверхности; at — в точке, у конкретного места.", examples: ["in Kazan, in the room", "on the wall", "at the bus stop, at school"] },
  { pair: "arrive in / arrive at", rule: "arrive in — в город, страну; arrive at — в конкретное место (станция, аэропорт).", examples: ["We arrived in Sochi.", "We arrived at the airport."] },
  { pair: "affect / effect", rule: "affect — глагол (влиять); effect — существительное (эффект, результат).", examples: ["Stress affects sleep.", "It had a positive effect."] },
  { pair: "advice / advise", rule: "advice — существительное, неисчисляемое (some advice, a piece of advice); advise — глагол.", examples: ["Can you give me some advice?", "The doctor advised me to rest."] },
  { pair: "practice / practise", rule: "в британском английском practice — существительное, practise — глагол.", examples: ["Practice makes perfect.", "I practise the piano every day."] },
  { pair: "lose / loose", rule: "lose [luːz] — терять, проигрывать; loose [luːs] — свободный, болтающийся.", examples: ["Don't lose your keys.", "These trousers are too loose."] },
  { pair: "quite / quiet", rule: "quite [kwaɪt] — довольно, вполне; quiet [ˈkwaɪət] — тихий.", examples: ["The test was quite easy.", "Please be quiet in the library."] },
];
