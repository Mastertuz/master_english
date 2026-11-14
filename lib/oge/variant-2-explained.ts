import type { ExplainedData } from "./explain";

/**
 * Разбор варианта 2: пояснения к каждому ответу письменной части, образцы письма и устных ответов.
 * Условия и ключи — в variant-2.ts, это издание книги без пояснений.
 */
export const variant2Explained: ExplainedData = {
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. К каждому ответу есть разбор; запись озвучена нейросетевым голосом",

  rules: {
    "20": "Оборот there is / there are сообщает о наличии предмета. Форма be согласуется с существительным после оборота: there was a calendar (единственное число), there were calendars (множественное). Время — по контексту: рассказ в прошлом, значит was / were.",
    "21": "Past Simple — законченное действие с точным указателем времени (last December, yesterday, in 2010). Неправильные глаголы берут вторую форму: buy – bought – bought, а не buyed. В утвердительном предложении did не нужен.",
    "22": "Страдательный залог: be в нужном времени + третья форма глагола. Нужен, когда подлежащее не совершает действие, а испытывает его: календарь не изобретает, его изобретают. Past Simple Passive: was / were + V3 — the calendar was invented.",
    "23": "Past Simple в придаточном после глагола в прошедшем времени: She wanted to say that she understood. Настоящее время (understands) здесь не подходит: оба действия относятся к прошлому. Understand — неправильный: understand – understood – understood.",
    "24": "Отрицание в Past Simple: did not (didn’t) + глагол в начальной форме. Если слово дано с NOT (NOT SAY), частица not обязательно входит в ответ: did not say или didn’t say. Просто said не засчитывается.",
    "25": "Порядковые числительные отвечают на вопрос «который по счёту?» и стоят после притяжательного местоимения: my eighteenth birthday. Образуются добавлением -th: eighteen → eighteenth (конечная e сохраняется; исключения: first, second, third, fifth, ninth, twelfth).",
    "26": "Future Simple (will + глагол) — предсказание о будущем с указателем tomorrow. После will глагол стоит в начальной форме без -s и -ed: Nothing will change. Nothing — неопределённое местоимение, оно означает «ничего» и отрицания уже содержит.",
    "27": "Present Perfect (have / has + V3) связывает прошлое действие с настоящим результатом. Торт заказан раньше, и сейчас это важно: он будет доставлен завтра. Ответ: have ordered или ’ve ordered.",
    "28": "Притяжательные прилагательные стоят перед существительным и отвечают на вопрос «чей?»: my, your, his, her, its, our, their. Здесь речь о римлянах (Ancient Romans), поэтому their own version. Местоимение they в этой позиции не подходит: оно может быть только подлежащим.",
    "29": "Причастие прошедшего времени может быть прилагательным: isolate → isolated («изолированный»). Прилагательное стоит перед существительным: this isolated island. Окончание -ed здесь не показывает время действия, а описывает состояние острова.",
    "30": "Суффикс -al образует прилагательные от существительных: nature → natural, nation → national, culture → cultural. Перед существительным resources нужно прилагательное: natural resources. Natural — «природный», nature — «природа».",
    "31": "Суффикс -ion / -ation образует существительные от глаголов: attract → attraction, inform → information, educate → education. После артикля и прилагательного (an irresistible …) нужно существительное: an irresistible attraction.",
    "32": "После глаголов love, like, enjoy, hate употребляется существительное или форма на -ing: If you love hiking. Hike → hiking: у глагола с немой e на конце буква e отпадает (hike → hiking).",
    "33": "Суффикс -ist обозначает человека по роду занятий: ecology → ecologist, science → scientist, art → artist. Артикль an стоит перед гласным звуком (an ecologist), а сказуемое If you are … требует существительного — названия человека.",
    "34": "Суффикс -y образует прилагательные от существительных: luck → lucky, rain → rainy, health → healthy. Перед существительным tourists нужно прилагательное: Lucky tourists — «Везучие туристы».",
  },

  choice: {
    1: {
      proof:
        "All you need to do is to buy three different products in our fruit and vegetables department. Please mind that dairy products like milk, cheese and cream, as well as meat products, like bacon or sausages, do not count.",
      why: "Шоколадку дают за три разных продукта из отдела фруктов и овощей. Lemons, bananas и carrots — три продукта именно из этого отдела.",
      trap: "Вариант 2: yogurt — молочный продукт (dairy), хлеб тоже не из отдела овощей и фруктов, в таком наборе подходит только apple. Вариант 3: sausages — мясной продукт, они в акции не учитываются.",
    },
    2: {
      proof:
        "After that, we decided to go to the cinema, as a whole class. A new film is on… I have to mute my phone now.",
      why: "Девочка идёт в кино с классом и просит маму не волноваться: телефон она отключает, значит, фильм вот-вот начнётся.",
      trap: "Вариант 1: разговор (conversation) вела мама — у неё была занята линия. Вариант 3: тест писали утром (we wrote a test in the morning), он уже позади.",
    },
    3: {
      proof:
        "Art exhibitions are not for me. I’d rather go to the cinema… — OK. Let’s go.",
      why: "Миа предлагает выставку, но Алекс отказывается и выбирает кино. Мия соглашается: Let’s go.",
      trap: "Вариант 1 — идея Мии, которую Алекс отверг. Вариант 2: друг Алекса не придёт, а тётя Мии приедет только через три часа — встреча отложена.",
    },
    4: {
      proof:
        "Yes, it’s going to be my last year at school. After finishing it, I’m going to the university, I hope.",
      why: "Бен ещё учится в школе: сейчас у него последний год. Университет — только планы на будущее.",
      trap: "Вариант 2: университет будет после школы. Вариант 3: gap year (год перерыва) — у друга Бена, а не у него самого.",
    },
    13: {
      proof:
        "These whales migrate seasonally within the Arctic and sub-Arctic regions, but they generally do not migrate outside the Arctic in the way that some birds leave their breeding grounds for different, much warmer climates.",
      why: "Утверждение говорит, что зимой белухи уплывают в тёплые воды Тихого океана. В тексте обратное: они мигрируют внутри Арктики и не покидают её ради тёплого климата. Это False.",
      trap: "Слова warmer climates есть в тексте, но они относятся к птицам. Предложение In spring and summer… but in autumn, they travel back, deeper into the Arctic Ocean тоже подтверждает: белухи уходят вглубь Арктики, а не в Тихий океан.",
    },
    14: {
      why: "В тексте нет ничего о том, как белухи охотятся на рыбу подо льдом и собираются ли они в группы для охоты. Говорится о миграции, дыхании подо льдом и спасении, но не об охоте. Информации нет, значит, Not stated.",
      trap: "Слова under the ice и gathered near the holes создают впечатление, что тема охоты затронута. Но группа у лунок — это животные, ищущие воздух, а не охотящиеся рыбу.",
    },
    15: {
      proof:
        "The whales were first seen from a helicopter that was checking ships at the end of the navigation season.",
      why: "Китов впервые заметили с вертолёта, который проверял суда (patrolling the area ≈ checking ships). Экипаж вертолёта — те, кто заметил китов. Это True.",
      trap: "Следующая фраза «people did not see any particular danger» не отменяет первой: заметили китов сразу, а опасность поняли позже.",
    },
    16: {
      proof: "Local fishermen did their best to help the whales. They broke the ice… and brought frozen fish to the belugas.",
      why: "Рыбаки сделали всё возможное: разбивали лёд и приносили замороженную рыбу. Утверждение, что они отказались помогать, противоречит тексту. Это False.",
      trap: "Фраза «However, that was not enough» говорит, что помощи оказалось мало, а не что рыбаки отказались.",
    },
    17: {
      why: "О том, кто был на борту ледокола, сказано только про капитана и команду (the captain, the crew). Биологи не упоминаются ни разу. Не сказано ни что они были, ни что их не было, поэтому Not stated.",
      trap: "Идея с музыкой могла прийти специалисту по животным, но в тексте её предлагает капитан. Выдумывать то, чего нет в тексте, нельзя.",
    },
    18: {
      proof: "The whales felt scared of the engine noise and refused to follow the icebreaker. Each time the engine started, they stopped moving.",
      why: "Звук двигателя испугал китов, и они отказывались плыть за ледоколом. Утверждение полностью подтверждается. Это True.",
    },
    19: {
      proof: "They tried different types of music, but classical music by Pyotr Ilyich Tchaikovsky worked best.",
      why: "Текст говорит, что музыка Чайковского подействовала лучше всего. Но ничего не сказано о том, что это любимый композитор капитана: выбирали по результату, а не по вкусу. Not stated.",
      trap: "Мысль «капитан выбрал любимую музыку» напрашивается сама, но в тексте её нет: музыку подбирали экспериментом.",
    },
  },

  rows: {
    6: {
      proof: "No, I’m still fourteen. I’m younger than my classmates.",
      why: "Возраст собеседницы — четырнадцать. Число по правилам пишется буквами: fourteen.",
      trap: "Интервьюер предположил fifteen, но собеседница сразу исправила его: No, I’m still fourteen.",
    },
    7: {
      proof: "But if you want to know which I prefer the most, it’s Literature.",
      why: "Любимый предмет — литература (Literature). Слово из записи пишется как прозвучало, регистр не важен.",
      trap: "Science и PE названы просто как интересные предметы (I enjoy many subjects), а любимым она называет только литературу.",
    },
    8: {
      proof: "Not roughly. There are exactly 80 books in my home collection at the moment.",
      why: "В домашней библиотеке ровно 80 книг. Число записывается буквами: eighty.",
      trap: "Выражения a small amount и roughly не называют число. Цифры 80 не принимаются: слово пишут буквами.",
    },
    9: {
      proof: "I like playing games — like football, basketball and even baseball sometimes. But what I do regularly is cycling.",
      why: "В таблице спрашивают, чем она занимается регулярно: это велосипед (cycling). Остальные виды спорта названы как игры, в которые она иногда играет.",
      trap: "Football, basketball, baseball — игры, а не регулярные занятия. Слово regularly стоит сразу перед cycling.",
    },
    10: {
      proof: "Do you have any pets at the moment? — A snake. I knew you would be surprised.",
      why: "Сейчас у неё живёт змея (snake): собеседница сама говорит, что интервьюер удивится.",
      trap: "Интервьюер ожидал puppy или kitten, но собака умерла, а щенка она возьмёт позже. Вопрос про питомца сейчас.",
    },
    11: {
      proof: "Finland is the first on my list. Besides, I’ve got friends there.",
      why: "Страна, которую она хочет посетить в ближайшее время, — Finland. Там у неё друзья, и Финляндия первая в списке.",
      trap: "Norway названа как страна, где она тоже не была, но первая в списке Финляндия. Australia — страна, куда переехал друг.",
    },
  },

  gaps: {
    20: {
      why: "Оборот there + be, рассказ в прошлом (Katie was standing). Существительное calendar в единственном числе, поэтому was.",
      trap: "Форма were — для множественного числа (there were calendars); is не подходит, потому что действие в прошлом.",
    },
    21: {
      why: "Past Simple: календарь куплен в конкретный момент прошлого (last December). Buy — неправильный глагол: buy – bought – bought.",
      trap: "Вариант have bought не годится с last December: Present Perfect не употребляется с точным указанием времени в прошлом. Форма buyed неверна.",
    },
    22: {
      why: "Календарь не изобретает, а изобретён: подлежащее the calendar испытывает действие. Нужен пассив в Past Simple: was invented.",
      trap: "Active invented означало бы, что календарь сам что-то изобрёл. Форма is invented не подходит по времени: речь о прошлом.",
    },
    23: {
      why: "Past Simple: She wanted to say that she understood. Глаголы связаны: рассказ в прошлом, поэтому в придаточном тоже прошедшее время.",
      trap: "Understand — неправильный глагол: understand – understood. Формы understanded и understands неверны.",
    },
    24: {
      why: "But she did not say anything — отрицание в Past Simple: did not + глагол в начальной форме. По условию слово дано с NOT, поэтому в ответе обе части.",
      trap: "Ответ said без not меняет смысл на противоположный. Ответ did not said неверен: после did глагол без -ed.",
    },
    25: {
      why: "My ___ birthday: перед существительным нужно порядковое числительное — «восемнадцатый» день рождения (в 18 лет). Образуется добавлением -th: eighteenth.",
      trap: "Количественное eighteen означало бы «восемнадцать дней рождения». Написание eighteenth оканчивается на -th, лишней e в середине нет.",
    },
    26: {
      why: "Nothing will change tomorrow: утверждение о будущем с указателем tomorrow — Future Simple.",
      trap: "Present Simple changes не подходит: событие ещё не произошло и не стоит в расписании. Форма will changes неверна: после will глагол без -s.",
    },
    27: {
      why: "Просьба не забыть, что торт заказан раньше: результат важен сейчас (торт доставят завтра). Present Perfect: I have ordered.",
      trap: "Простое ordered описывает лишь прошлое действие, а здесь важен результат сейчас. Форма has ordered неверна: после I нужно have.",
    },
    28: {
      why: "Ancient Romans created their own version: притяжательное прилагательное their стоит перед существительным и показывает, чья версия.",
      trap: "They — местоимение-подлежащее, перед существительным оно не стоит. Them — дополнение, тоже не подходит.",
    },
    29: {
      why: "Нужно прилагательное перед существительным island. Isolate → isolated («изолированный»): остров далеко от материка.",
      trap: "Форма isolation — существительное, isolating — «изолирующий». Подходит именно причастие isolated.",
    },
    30: {
      why: "Rich in ___ resources: перед существительным нужно прилагательное. Nature → natural: «природные ресурсы».",
      trap: "Nature — существительное, но перед resources нужно прилагательное. Форма naturally — наречие.",
    },
    31: {
      why: "Слово стоит после an irresistible, то есть нужно существительное: attract → attraction («достопримечательность, привлекательное место»).",
      trap: "Attractive — прилагательное: два прилагательных подряд (irresistible attractive) здесь не подходят.",
    },
    32: {
      why: "If you love hiking: после глагола love нужна форма на -ing. Hike → hiking, буква e в конце отпадает.",
      trap: "Hiker — человек, но любят не «туриста», а занятие. Форма hikeing неверна: e перед -ing пропадает.",
    },
    33: {
      why: "If you are an ecologist: нужно существительное — название специальности. Ecology → ecologist; артикль an перед гласным подтверждает форму.",
      trap: "Ecological — прилагательное, ecology — название науки. Требуется человек, поэтому -ist.",
    },
    34: {
      why: "Lucky tourists: перед существительным tourists нужно прилагательное. Luck → lucky: суффикс -y.",
      trap: "Luckily — наречие: оно было бы возможно в начале всего предложения, но здесь перед существительным нужно прилагательное.",
    },
  },

  matching5: {
    A: {
      proof: "It is a lovely place to live in — very green and peaceful. There are few cars… You can cycle or walk wherever you want.",
      why: "Говорящий описывает зелёный, спокойный маленький город с набережной и без пробок. Рубрика 5, A nice and quiet place.",
      trap: "Рубрика 6 не подходит: о динамичной жизни говорит его друг, мечтающий о большом городе, а сам говорящий считает свой город лучшим.",
    },
    B: {
      proof: "Historians say that it was founded more than 500 years ago… Now it’s a fast-developing industrial city.",
      why: "Говорящий рассказывает о возрасте города, старых домах и музее в мельнице, а потом о современном промышленном городе. Рубрика 3, History and modern life.",
      trap: "Рубрика 1: электростанция и завод медицинской техники упомянуты, но это лишь часть описания, а о высоких технологиях всего города речи нет.",
    },
    C: {
      proof: "Our annual autumn fair always attracts lots of people. We have been holding it since the 19th century… Some people wear traditional costumes.",
      why: "Говорящий рассказывает об ежегодной ярмарке, игре, танцах и традиционных костюмах. Рубрика 2, Customs and traditions.",
      trap: "Рубрика 3: 19 век упомянут, но главное — традиция праздника, а не история города.",
    },
    D: {
      proof: "I live in a big modern city with more than five million people… There are a lot of theatres, cinemas, clubs… the career opportunities are good.",
      why: "Говорящий живёт в большом современном городе, где много развлечений и возможностей. Рубрика 6, A dynamic and exciting place.",
      trap: "Рубрика 1: о новых технологиях ничего не сказано. Рубрика 5: большой город с миллионами жителей не бывает тихим.",
    },
    E: {
      proof: "In our project, our town is based on smart technologies and artificial intelligence… only eco-friendly construction materials are used.",
      why: "Проект города будущего построен на умных технологиях и искусственном интеллекте. Рубрика 1, An innovative and high-tech place.",
      trap: "Рубрика 5: город чистый и зелёный, но главная мысль — технологии, а не тишина.",
    },
  },

  matching12: {
    A: {
      proof: "Some linguists believe that @ symbol… existed in Latin. Historians have found ancient records where the sign was used for measuring liquids. Probably the most realistic explanation is that it appeared on typewriters as a separate key.",
      why: "В тексте говорится о происхождении знака: он был в латыни, в древних записях, на пишущих машинках. Значит, знак использовали до компьютеров. Вопрос 5.",
      trap: "Вопрос 6: о том, как знак попал в компьютерную сеть, рассказывает текст B, а не A.",
    },
    B: {
      proof: "Ray Tomlinson… The main problem he faced was how to send messages from one computer to another… He used it to separate names of computers, so the system started working properly.",
      why: "Инженер Рэй Томлинсон нашёл знак @ на клавиатуре и применил его в компьютерной сети. Вопрос 6.",
      trap: "Вопрос 5: о том, использовали ли знак раньше, говорит не B, а A. Вопрос 7: об обновлениях сервисов речь в E.",
    },
    C: {
      proof: "An email address uses the @ symbol, and it is impossible to create an email address without it. The symbol @ separates the user’s name from the name of the mail service.",
      why: "Текст объясняет, для чего нужен знак в адресе: он отделяет имя пользователя от имени почтового сервиса. Вопрос 1.",
      trap: "Вопрос 4: о других символах адреса ни слова, текст говорит только про @. Поэтому вопрос 4 лишний.",
    },
    D: {
      proof: "Italians say it looks like a snail, while the French compare it to a monkey’s tail… In Sweden, for example, people associate it with a traditional cinnamon bun.",
      why: "Итальянцы видят улитку, французы — хвост обезьяны, шведы — булочку с корицей. Это ассоциации европейцев со знаком. Вопрос 2.",
      trap: "Вопрос 3: русские пользователи в тексте D не упоминаются, о них говорится в F.",
    },
    E: {
      proof: "In the 2000s, email services were improved with cloud storage and many other features.",
      why: "Текст рассказывает об улучшениях почтовых сервисов в 2000-х: облачное хранилище и другие возможности. Вопрос 7.",
      trap: "Вопрос 6: Томлинсон упомянут, но речь не о том, как знак вошёл в сеть, а о результатах его технологии.",
    },
    F: {
      proof: "In Russian, it received a surprising nickname — ‘a dog’. Because of its funny animal image, the name became popular among users and IT specialists.",
      why: "У русскоязычных пользователей знак получил прозвище «собака», которое стало популярным. Вопрос 3.",
      trap: "Вопрос 2: европейцев в F нет. Первое предложение об английском названии at sign может сбить, но решает сообщение о русском названии.",
    },
  },

  writing: {
    sample:
      "Dear Alice,\n\nThanks for your email! I was really glad to hear from you.\n\nYou asked which school holidays I prefer. I like summer holidays best because they are the longest, and I can spend a lot of time outdoors with my friends.\n\nOn holiday my day is quite relaxed. I get up late, have breakfast and then go swimming or play football in the yard. In the evening I usually read books or watch films.\n\nTo keep up my English skills, I watch my favourite series in English and chat with a pen friend online. It is fun and useful at the same time.\n\nWrite back soon!\n\nBest wishes,\nAnna",
    templateSample:
      "Dear Alice,\n\nThank you for your recent e-mail. I was very glad to hear from you again!\n\nAs for your questions, I prefer winter holidays too, because there is snow, and I can go skiing and skating with my friends. Besides, we celebrate the New Year and Christmas then.\n\nWhen I am on holiday, I usually get up late, help my mum with the housework and meet my friends in the afternoon. In the evening we play board games or watch films.\n\nTo keep up my English, I read short stories and listen to English songs every day.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nAlina",
  },

  speaking: {
    hardWords: [
      { word: "rainforests", tip: "/ˈreɪnfɒrɪsts/ — «РЕЙН-форист», ударение на первый слог" },
      { word: "equator", tip: "/ɪˈkweɪtə/ — «и-КВЕЙ-тэ», ударение на второй слог" },
      { word: "climate", tip: "/ˈklaɪmət/ — «КЛАЙ-мэт», не «климат»" },
      { word: "tropical", tip: "/ˈtrɒpɪkl/ — «ТРОП-икл»" },
      { word: "jungles", tip: "/ˈdʒʌŋɡlz/ — «ДЖАН-глз»" },
      { word: "ecosystems", tip: "/ˈiːkəʊsɪstəmz/ — ударение на первый слог, «И-коу-систэмз»" },
      { word: "insects", tip: "/ˈɪnsekts/ — «ИН-сектс», ударение на первый слог" },
      { word: "metres", tip: "/ˈmiːtəz/ — «МИ-тэз»" },
      { word: "height", tip: "/haɪt/ — «хайт», на конце нет [th]" },
      { word: "protects", tip: "/prəˈtekts/ — ударение на второй слог" },
      { word: "destroyed", tip: "/dɪˈstrɔɪd/ — окончание -ed звучит как [d]" },
      { word: "1980s", tip: "the nineteen eighties — год читают парами, множественное число -s" },
      { word: "rainfall", tip: "/ˈreɪnfɔːl/ — «РЕЙН-фол»" },
      { word: "serious", tip: "/ˈsɪəriəs/ — «СИ-риэс»" },
      { word: "human activity", tip: "/ˈhjuːmən ækˈtɪvəti/ — ударение в activity на второй слог" },
    ],
    task2Samples: [
      "I’ve had my mobile phone for about two years. I got it as a present for my birthday, and I’m very happy with it.",
      "I use my mobile phone for many things. I call my parents and friends, send messages, listen to music and take photos.",
      "I normally turn off the sound of my phone at school, in the library and in the cinema. It is rude to disturb other people there.",
      "I find the alarm clock and the calculator very useful. I also like the map, because it helps me find the way in a new place.",
      "I would miss the Internet most of all. I couldn’t chat with my friends or look up information, and I would feel rather lonely.",
      "People can use a mobile phone to learn new words in special apps. They can also watch films in English or chat with foreign friends.",
    ],
    task3Sample:
      "I’d like to tell you about sports.\nIn my opinion, doing sports is becoming more and more popular with teenagers. They want to be healthy and strong, and many of them follow famous sportspeople on social media.\nIn my city, teenagers can use a lot of sports facilities. There are stadiums, swimming pools, a skating rink and a few gyms, and many of them offer special lessons for young people.\nI regularly go swimming. I have training twice a week, and at the weekend I sometimes cycle with my friends.\nAs for my attitude to sport, I think it is very important. Sport keeps me fit, gives me energy and helps me relax after school.\nThat’s all I wanted to say about sports.",
  },
};
