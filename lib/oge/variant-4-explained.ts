import type { ExplainedData } from "./explain";

/**
 * Разбор варианта 4: пояснения к каждому ответу письменной части, образцы письма и устных ответов.
 * Условия и ключи — в variant-4.ts, это издание книги без пояснений.
 */
export const variant4Explained: ExplainedData = {
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. К каждому ответу есть разбор; запись озвучена нейросетевым голосом",

  rules: {
    "20": "После предлога (between, of, with, for) местоимение стоит в объектном падеже: I – me, he – him, she – her, it – it, we – us, they – them. Between them — «между ними»; they после предлога невозможно, оно бывает только подлежащим.",
    "21": "Past Simple — последовательные действия в прошлом: Then she stood up, came up to the cupboard and added chips. Stand — неправильный глагол: stand – stood – stood. Формы standed и standing неверны.",
    "22": "Present Perfect (have / has + V3) — действие закончено, а результат важен сейчас: I’ve found out that almost everyone does some sport — «я выяснила, и теперь знаю». Past Simple found тоже принимается: оба варианта в ключе. Find — неправильный глагол: find – found – found.",
    "23": "Present Simple, третье лицо единственного числа: к глаголу добавляется -s / -es (Sandra practises). После -ice / -ise в глаголе s присоединяется без изменений. Британский вариант practise, американский practice: в ключе допустимы оба.",
    "24": "Модальный глагол can не имеет формы с -ed: прошедшее время — could. Слово дано с NOT, ответ из двух слов: could not или couldn’t. Подсказка: A year ago — действие в прошлом.",
    "25": "Страдательный залог (Passive): подлежащее He не приглашает, а его приглашают. Past Simple Passive: was / were + V3 → was invited. Подсказка: last Monday — прошедшее время, а в главной роли тот, кому предложили вступить в клуб.",
    "26": "Сравнительная степень (comparative): good – better – best — исключение, степени сравнения образуются от другого корня. После слова even и перед than нужна сравнительная форма: even better than him.",
    "27": "Рассказ ведётся в прошлом (Jess didn’t sound enthusiastic), поэтому и There is → There was. Конструкция there was / were согласуется со следующим существительным: an expression — единственное число, значит was.",
    "28": "Решение или обещание, принятое в момент разговора, выражает will (в первом лице допустим shall): I’ll call you tomorrow — «позвоню тебе завтра». Ответ из двух слов: will call, shall call или сокращение ’ll call.",
    "29": "После предлога (used for) стоит существительное. Суффикс -ation образует существительные от глаголов: communicate → communication («общение»), inform → information.",
    "30": "Слово после was и перед but стоит как прилагательное: was original but not easy to understand. Origin — «происхождение» (существительное), original — «изначальный, оригинальный». Суффикс -al образует прилагательные: tradition → traditional.",
    "31": "Наречие стоит перед причастием designed и отвечает на вопрос «как?»: carefully designed — «тщательно разработаны». Суффикс -ly образует наречия от прилагательных: careful → carefully.",
    "32": "Суффикс -er обозначает человека по занятию: write → writer, teach → teacher. An Egyptian writer — «египетский писец (писатель)»: артикль an стоит перед Egyptian, а нужное слово — существительное.",
    "33": "Суффикс -less означает «без»: price → priceless («бесценный»), care → careless. После are стоит прилагательное, которое объясняет, почему свитки хранят в музеях.",
    "34": "Приставка un- меняет значение на противоположное: available → unavailable («недоступны»). Смысл подсказывает That is why: из-за хрупкости свитки нельзя показывать публике, и поэтому они недоступны.",
  },

  choice: {
    1: {
      proof:
        "The awards ceremony is to be held tomorrow, on Friday, at 5 p.m. in the main building of the school.",
      why: "Победители получат награды на церемонии награждения: она состоится завтра, в пятницу. Это и есть ответ на вопрос.",
      trap: "Вариант 2 (Saturday) — лингвистическая конференция, вариант 3 (Sunday) — праздничная вечеринка: об этих событиях сказано после церемонии, награды на них не вручают.",
    },
    2: {
      proof:
        "It’s just that we are not going to have the last two lessons today. I don’t know the reason why — we were not told.",
      why: "Последних двух уроков сегодня не будет, поэтому девочка и просит папу забрать её пораньше.",
      trap: "Вариант 1: Don’t worry, I’m perfectly well — она здорова. Вариант 3: в библиотеке она будет ждать, если папа занят, но это не причина просьбы.",
    },
    3: {
      proof:
        "My major is construction engineering. It’s about designing and building highways, bridges, railways.",
      why: "Марк учится на инженера-строителя, его специальность — construction engineering. Ответ: Engineering.",
      trap: "Вариант 1: Нора предполагает, что он станет врачом, как отец, но он отвечает: I’ve never wanted to be in medicine. Вариант 2: о журналистике сказано лишь, что мама Марка писала статью в журнал.",
    },
    4: {
      proof:
        "Spring is my favourite too… For me, it’s the best type of weather. Changeable and unpredictable.",
      why: "Элис считает лучшей погоду переменчивую и непредсказуемую, а Кен говорит: Spring is my favourite too — «весна и мой любимый сезон тоже». Значит, любимое время года обоих — весна.",
      trap: "Варианты 2 и 3: лето и осень Элис как раз не любит: I hate… a long succession of rainy days in the autumn. Or constant heat in the summer.",
    },
    13: {
      why: "В тексте сказано, что шимпанзе, гориллы и орангутанги — человекообразные обезьяны (apes). О том, что гориллы и шимпанзе враждуют, нет ни слова. Not stated.",
      trap: "Гориллы упомянуты в одном ряду с шимпанзе, но это перечисление родственных видов, а не рассказ об их отношениях.",
    },
    14: {
      proof:
        "At that time, most researchers observed animals from a distance. Jane Goodall did something different — she lived among the chimpanzees and patiently gained their trust.",
      why: "Остальные учёные наблюдали за животными издали, а Гудолл поселилась среди шимпанзе: это новый, необычный метод. Её method was unusual. True.",
    },
    15: {
      proof:
        "Jane Goodall observed chimpanzees making and using tools to get food, such as sticks to catch insects and stones to crack nuts.",
      why: "Гудолл увидела, что шимпанзе делают и используют орудия, когда надо добыть еду. Это значит, что при необходимости они способны пользоваться орудиями. True.",
    },
    16: {
      why: "В тексте сказано, что у шимпанзе есть эмоции, характеры и социальная жизнь. О влиянии сезонного питания на их поведение ничего нет. Not stated.",
      trap: "Утверждение называет характер (character), о котором в тексте говорится (personalities), но вторая половина — про сезонный рацион — не подтверждена и не опровергнута.",
    },
    17: {
      proof:
        "One of her favourite possessions was a toy chimpanzee named Jubilee.",
      why: "Юбилей — игрушечная обезьянка из детства Джейн Гудолл, а не самый старый шимпанзе, за которым она наблюдала. Утверждение противоречит тексту. False.",
    },
    18: {
      proof:
        "With Leakey’s support, she later earned a PhD from the University of Cambridge.",
      why: "Гудолл получила степень доктора философии в Кембриджском университете, то есть университетская степень у неё была. Утверждение «никогда не имела» противоречит тексту. False.",
    },
    19: {
      proof:
        "In 1977, she founded the Jane Goodall Institute, which continues to protect wildlife and support communities around the world.",
      why: "Институт Джейн Гудолл, основанный в 1977 году, защищает дикую природу. Значит, она создала организацию для защиты животных и природы. True.",
    },
  },

  rows: {
    6: {
      proof:
        "No. I’m a coach. I train these heroes who won the most challenging football game yesterday.",
      why: "Респондент работает тренером: coach. Интервьюер предполагает, что он менеджер клуба, но он поправляет.",
      trap: "Manager, doctor, reporter и players — другие роли, названные в разговоре. Работа респондента — только coach.",
    },
    7: {
      proof:
        "No, I don’t. I’m forty. Fifteen years of which I’ve been working as a coach for the club.",
      why: "Возраст респондента — 40 лет. Число записывается буквами: forty.",
      trap: "Fifteen — это стаж работы тренером в клубе, а не возраст. Цифра 40 не принимается: числа пишут буквами.",
    },
    8: {
      proof:
        "We got back from a match in Turkey only yesterday. And before Turkey we had played in Greece and Macedonia.",
      why: "Последняя страна, где побывала команда, — Turkey: из Турции вернулись только вчера.",
      trap: "Greece и Macedonia были до Турции, то есть раньше. Вопрос про последнюю страну.",
    },
    9: {
      proof:
        "Lots of pizza — our favourite dish ever. Normally I consume eggs, milk, greens — all sorts of healthy foods.",
      why: "Любимое блюдо команды и тренера — pizza. Яйца, молоко и зелень — его обычная здоровая еда, а не любимая.",
      trap: "Eggs, milk, greens — повседневный здоровый рацион. Вопрос о любимой еде, а любимой названа пицца.",
    },
    10: {
      proof:
        "My parents wanted me to learn the guitar and my sister — the piano. One day we swapped instruments… Now she plays the guitar and I play the piano!",
      why: "Дети поменялись инструментами, и теперь респондент играет на пианино: piano.",
      trap: "Guitar родители хотели для него, но теперь на гитаре играет его сестра. Jazz band и rock band — музыканты на вечеринке.",
    },
    11: {
      proof:
        "I need to take my dog from my friend’s place… He’s got a cat and a couple of parrots himself.",
      why: "Питомец респондента — собака (dog): друг присматривал за ней, пока тот был занят.",
      trap: "Cat и parrots — питомцы друга, а не респондента.",
    },
  },

  gaps: {
    20: {
      why: "Between ___: после предлога between нужно местоимение в объектном падеже. Речь о двух девочках, they → them.",
      trap: "Форма they стоит только на месте подлежащего. Their — притяжательная форма, после предлога она не подходит: нужно «между ними».",
    },
    21: {
      why: "Then she ___ up, came up to the cupboard and added chips: цепочка последовательных действий в прошлом, Past Simple. Stand → stood.",
      trap: "Форма standed неверна: stand неправильный глагол. Форма stands — настоящее время, а рассказ ведётся в прошлом.",
    },
    22: {
      why: "I’ve found out that almost everyone does some sport: Present Perfect, результат («я выяснила, и теперь знаю») важен сейчас. Past Simple found тоже принимается.",
      trap: "Форма finded неверна: find – found – found. Форма finding без вспомогательного глагола не образует нужное время.",
    },
    23: {
      why: "Jack is a footballer, Sandra practises yoga and Sam’s often seen in the pool: Present Simple, Sandra — she, поэтому к глаголу добавляется -s. Practise или practice — в ключе оба варианта.",
      trap: "Форма practise без -s не согласуется с подлежащим Sandra. Форма practising означала бы действие в этот момент.",
    },
    24: {
      why: "A year ago, he couldn’t swim at all: прошедшее время от can — could. Слово дано с NOT, поэтому ответ из двух слов.",
      trap: "Ответ can’t swim — настоящее время, а подсказка A year ago требует прошедшего. Форма canned неверна: у can нет формы с -ed.",
    },
    25: {
      why: "He was invited to join the Club last Monday: страдательный залог (его пригласили), Past Simple. Was invited.",
      trap: "Форма invited без was означала бы, что он сам пригласил кого-то. Форма has been invited не употребляется с last Monday: нужно Past Simple.",
    },
    26: {
      why: "We can do even better than him: сравнительная степень от good — better. Слово even усиливает сравнение.",
      trap: "Формы gooder и more good неверны: good – better – best — особый случай, как bad – worse – worst.",
    },
    27: {
      why: "There was an expression of doubt in her eyes: рассказ в прошлом, поэтому was. Existential there + was с единственным числом (an expression).",
      trap: "Форма is не соответствует прошедшему времени всего абзаца. Форма were нужна только перед множественным числом.",
    },
    28: {
      why: "I’ll call you tomorrow to discuss your ideas: решение или обещание, действие в будущем. Will call, в первом лице допустим shall call.",
      trap: "Простое call без will относится к привычке или инструкции. Форма would call — «позвонил бы», а не обещание.",
    },
    29: {
      why: "Used for ___ in Ancient Egypt: после предлога for нужно существительное. Communicate → communication («общение»).",
      trap: "Communicate — глагол, после предлога он не подходит. Communicative — прилагательное «общительный».",
    },
    30: {
      why: "The system was ___ but not easy to understand: нужно прилагательное, parallel с not easy. Origin → original («оригинальный, самобытный»).",
      trap: "Origin — существительное («происхождение»), а after was перед but нужно прилагательное. Originally — наречие.",
    },
    31: {
      why: "Hieroglyphs were ___ designed: слово определяет причастие, поэтому нужно наречие. Careful → carefully («тщательно»).",
      trap: "Careful — прилагательное, оно не может определять причастие. Care — существительное.",
    },
    32: {
      why: "It took an Egyptian ___ a lot of time: нужно существительное, обозначающее человека. Write → writer («писец, автор»).",
      trap: "Writing — «письмо» (процесс), писать должен человек. Written — причастие, а не обозначение человека.",
    },
    33: {
      why: "The ancient scrolls are ___: они хранятся в музеях, потому что очень ценные. Price + -less = priceless («бесценные»).",
      trap: "Pricey означает «дорогой», но это разговорное слово и в ключе его нет. Priced — «оценён», смысл другой.",
    },
    34: {
      why: "That is why they are ___ to the public: из-за хрупкости свитки нельзя показывать, значит, они недоступны. Available → unavailable.",
      trap: "Available — «доступны»: смысл противоположен тексту, ведь свитки хранятся в музеях. Форма disavailable не существует.",
    },
  },

  matching5: {
    A: {
      proof:
        "The average temperature on the planet is rising. The ice-caps are melting, the level of the ocean is getting higher.",
      why: "Говорящий рассказывает о том, что средняя температура на планете растёт и тают льды. Рубрика 1, Global warming.",
    },
    B: {
      proof:
        "The problem of most big cities, where it’s hard to breathe… When they get stuck in traffic jams, the amount of gases emitted into the atmosphere increases several times.",
      why: "Говорящий объясняет, что в больших городах трудно дышать из-за выхлопных газов машин. Рубрика 4, Air pollution.",
      trap: "Рубрика 1: о потеплении не говорится, речь о загрязнении воздуха в городах.",
    },
    C: {
      proof: "We need to be very economical with energy and water.",
      why: "Говорящая призывает экономить электричество и воду: мы привыкли к удобствам, но их надо расходовать бережно. Рубрика 2, Careful spending.",
    },
    D: {
      proof:
        "Doctors say that the city is not a very good place for my daughter — she gets ill too often here. The polluted environment is the main reason.",
      why: "Главная мысль — дочь часто болеет из-за городской среды, поэтому семья переезжает в деревню. Рубрика 5, Health problems.",
      trap: "Рубрика 4 (Air pollution) подходит к высказыванию B. Здесь загрязнение лишь причина, а рассказ о болезнях ребёнка.",
    },
    E: {
      proof:
        "Careless tourists… throw plastic cups, plates and polyethylene packaging into the water. Marine animals can mistake the rubbish for food and swallow it.",
      why: "Говорящая объясняет, как туристы загрязняют океан пластиком и вредят морским животным. Рубрика 6, Sea pollution.",
      trap: "Рубрика 3 (Natural disasters) лишняя: стихийные бедствия не упоминаются ни одним говорящим.",
    },
  },

  matching12: {
    A: {
      proof: "The Golden Ring became especially famous in the 1960s and 1970s.",
      why: "Текст рассказывает, когда маршрут стал популярен: в 1960–70-е годы, когда вырос интерес к истории Древней Руси. Вопрос 3.",
    },
    B: {
      proof:
        "The Golden Ring, a tour route that includes several ancient Russian towns with their old churches and monasteries.",
      why: "Текст объясняет, что такое «Золотое кольцо»: туристический маршрут по нескольким древнерусским городам. Вопрос 1 — к чему относится название.",
      trap: "В тексте F тоже сказано, откуда взялось слово golden, но он отвечает на вопрос 2: в нём названо имя автора и серия статей, давшая имя маршруту.",
    },
    C: {
      proof:
        "Each of the towns is wonderful, but the main gem in the collection is probably the Trinity Lavra of St. Sergius in the town of Sergiev Posad.",
      why: "Главная жемчужина маршрута — Троице-Сергиева лавра в Сергиевом Посаде: самый удивительный объект. Вопрос 4.",
    },
    D: {
      proof:
        "A standard tour usually takes between two and five days, but tourist agencies also offer extended trips. They may be up to ten days or even longer.",
      why: "Обычная поездка длится от двух до пяти дней, а расширенные — до десяти и дольше. Вопрос 7.",
    },
    E: {
      proof:
        "In all of the towns, you will find elegant white-stone buildings and bright domes. The wooden architecture… is recognized as a typical feature of the whole route.",
      why: "Что объединяет города маршрута: белокаменные здания, яркие купола, деревянная архитектура. Вопрос 6.",
    },
    F: {
      proof:
        "The name was created by the journalist and historian Yuri Bychkov who published a series of articles about the towns under the title of The Golden Ring.",
      why: "Название придумал журналист и историк Юрий Бычков, опубликовав цикл статей. Это ответ на вопрос о том, как появилось название. Вопрос 2.",
      trap: "Вопрос 5 (самый древний объект) остался без ответа: ни в одном тексте не сказано, какое место старше всех.",
    },
  },

  writing: {
    sample:
      "Dear Sue,\n\nThanks for your email! I was sorry to hear that you felt sick and missed the party.\n\nI usually go to bed at ten o’clock, because I get up at seven for school. At weekends I stay up a little later, but never after midnight.\n\nI eat fast food rarely, maybe once or twice a month, when I go out with my friends. At home we cook fresh soup, fish and vegetables, and I prefer them.\n\nTo stay healthy, I do sports three times a week, drink a lot of water and walk with my dog every day.\n\nWrite back soon!\n\nBest wishes,\nAnna",
    templateSample:
      "Dear Sue,\n\nThank you for your recent message. I was very glad to hear from you again, but sorry that you were ill!\n\nAs for your questions, I usually go to bed at about half past ten. I know it would be better to sleep more, so I try not to use my phone in the evening.\n\nI have fast food once a week or less, usually after school with my classmates. My mother says it is unhealthy, and I agree with her.\n\nTo stay healthy, I play football, eat fruit every day and spend a lot of time outdoors.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nIvan",
  },

  speaking: {
    hardWords: [
      { word: "sketch", tip: "/sketʃ/ — «СКЕЧ», один слог" },
      { word: "captures", tip: "/ˈkæptʃəz/ — «КЭП-чез»" },
      {
        word: "buildings",
        tip: "/ˈbɪldɪŋz/ — «БИЛ-дингз», буква u не читается",
      },
      { word: "cafés", tip: "/ˈkæfeɪz/ — «КЭ-фэйз», ударение на первый слог" },
      { word: "underground", tip: "/ˈʌndəɡraʊnd/ — «АН-дэ-граунд»" },
      { word: "275", tip: "two hundred and seventy-five" },
      { word: "2025", tip: "twenty twenty-five — год читают парами" },
      {
        word: "ceremony",
        tip: "/ˈserəməni/ — «СЭ-рэ-мэ-ни», ударение на первый слог",
      },
      { word: "awards", tip: "/əˈwɔːdz/ — «э-УОДЗ»" },
      { word: "equipment", tip: "/ɪˈkwɪpmənt/ — «и-КВИП-мэнт»" },
      { word: "memory", tip: "/ˈmeməri/ — «МЭ-мэ-ри»" },
      {
        word: "creativity",
        tip: "/ˌkriːeɪˈtɪvəti/ — «кри-эй-ТИ-ви-ти», ударение на третий слог",
      },
      { word: "definitely", tip: "/ˈdefɪnətli/ — «ДЭ-фи-нэт-ли»" },
      {
        word: "everyday",
        tip: "/ˈevrideɪ/ — «ЭВ-ри-дэй», перед существительным пишется слитно",
      },
    ],
    task2Samples: [
      "I usually have three meals a day: breakfast, lunch and dinner. Sometimes I also have a light snack, for example an apple, between lunch and dinner.",
      "In my opinion, breakfast is the most important meal. It gives you energy for the whole morning, and you can concentrate better at school.",
      "In our school canteen I usually have soup, some meat or fish with a side dish and a glass of juice. Sometimes I also take a salad.",
      "I don’t mind fast food sometimes, but I think it is not healthy. It contains too much fat, salt and sugar, so I eat it only occasionally.",
      "Yes, I think it is important. If you can cook, you can eat healthy and tasty food, and you don’t depend on other people or on restaurants.",
      "I would recommend sleeping eight hours, doing sport regularly and eating more fruit and vegetables. It is also better not to spend too much time at the computer.",
    ],
    task3Sample:
      "I’d like to tell you about travelling.\nNowadays most people travel by plane or by train. Planes are fast, and trains are comfortable and not very expensive. Some people prefer going by car, because they can stop wherever they like.\nWhen people visit a new place, they usually look around the sights, take a lot of photos and try local food. Some of them also buy souvenirs for their friends and relatives.\nOne day I would like to visit Japan. I’m interested in its culture and technologies, and I would love to see Mount Fuji and try real sushi.\nAs for my attitude to travelling, I like it very much. It helps you learn about other countries and become more open-minded.\nThat’s all I wanted to say about travelling.",
  },
};
