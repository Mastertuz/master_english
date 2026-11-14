import type { ExplainedData } from "./explain";

/**
 * Разбор варианта 3: пояснения к каждому ответу письменной части, образцы письма и устных ответов.
 * Условия и ключи — в variant-3.ts, это издание книги без пояснений.
 */
export const variant3Explained: ExplainedData = {
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. К каждому ответу есть разбор; запись озвучена нейросетевым голосом",

  rules: {
    "20": "После предлога (of, with, to, for, about) местоимение стоит в объектном падеже: I – me, he – him, she – her, it – it, we – us, they – them. One of them — «один из них»; they после предлога невозможно, оно бывает только подлежащим.",
    "21": "Past Continuous (was / were + -ing) описывает действие как процесс в определённый период прошлого: он гостил у Тины все выходные, пока родители были в отпуске. Past Simple (stayed) тоже принимается: оба варианта в ключе. Глагол to be при подлежащем he — was.",
    "22": "Существительные на согласную + y образуют множественное число заменой y на ies: story → stories, city → cities. Не путать с гласной + y: day → days. Alien stories — «истории про пришельцев», множественное число после слова alien, потому что речь о многих рассказах.",
    "23": "Past Simple — действие в прошлом: One day, I even drew… Draw — неправильный глагол: draw – drew – drawn. Формы drawed и drawn без have неверны.",
    "24": "Порядковые числительные: nine → ninth (буква e перед -th отпадает), как и в eight → eighth. Исключения: first, second, third, fifth, twelfth. После my перед существительным birthday нужно порядковое числительное: my ninth birthday.",
    "25": "Согласование времён. После told (прошедшее) будущее время заменяется на «будущее в прошедшем»: will come → would come. Прямая речь: I said, ‘The aliens will come to my party’; в косвенной речи after told форма will уже невозможна.",
    "26": "Past Simple, отрицание: did not (didn’t) + глагол в начальной форме. Слово дано с NOT (NOT WANT), поэтому частица not входит в ответ: did not want или didn’t want. Простое wanted не засчитывается.",
    "27": "Present Perfect (have / has + V3) — действие началось в прошлом и связано с настоящим: Scientists have been looking for a long time. С yet в отрицании: they haven’t found anything yet. Past Simple didn’t find с yet не сочетается.",
    "28": "Present Continuous (am / is / are + -ing) — действие происходит в момент речи, подсказка right now: Maybe they are looking at us right now. Look at — смотреть на кого-то. Форма look или looks здесь не подходит: нужен процесс.",
    "29": "Приставка un- меняет значение на противоположное: usual → unusual. Перед существительным places нужно прилагательное, а после one of the most — превосходная степень: one of the most unusual places («одни из самых необычных мест»).",
    "30": "Суффикс -ion / -ation образует существительные от глаголов: populate → population, inform → information. Population — «население». Слово стоит после артикля The и является подлежащим предложения: The population of the region is small.",
    "31": "Суффикс -ous образует прилагательные от существительных: danger → dangerous, fame → famous, courage → courageous. Слово присоединено союзом and к active: still active and dangerous — оба прилагательные.",
    "32": "Суффикс -or / -er обозначает человека: visit → visitor, act → actor. После each существительное стоит в единственном числе: each visitor. Форма visitors (множественное) после each неверна, как и глагол visiting.",
    "33": "Суффикс -al образует прилагательные от существительных: education → educational, tradition → traditional. Слово параллельно прилагательному enjoyable в конструкции not only … but …: not only enjoyable but educational, too — «не только приятными, но и познавательными».",
    "34": "Суффикс -ly образует наречия от прилагательных: proud → proudly. Наречие определяет глагол highlight, отвечает на вопрос «как?»: guides proudly highlight — «гиды с гордостью подчёркивают». Прилагательное proud не может определять глагол.",
  },

  choice: {
    1: {
      proof:
        "To win this wonderful prize, you need to take part in a quest and answer questions about our bookshop, which is the oldest in our town and has a great history.",
      why: "Чтобы выиграть мастер-класс, нужно ответить на вопросы о книжном магазине и его истории. Значит, нужно знать историю магазина.",
      trap: "Вариант 1: мастер-класс по писательскому мастерству — это сам приз, а не условие. Вариант 3: скидочные карты получают все участники квеста, они к главному призу отношения не имеют.",
    },
    2: {
      proof:
        "I’m calling all my friends, just in case someone has seen a black Labrador with a grey collar… If you happen to see a black one, call me at once!",
      why: "Пропала чёрная собака Мии, лабрадор с серым ошейником. Мия просит звонить, если увидят чёрную собаку.",
      trap: "Вариант 2: серыми были ошейник и собака соседей, которая оказалась не её. Вариант 3: золотистый ретривер тоже оказался чужой собакой.",
    },
    3: {
      proof:
        "It looks like an insect bite… I can see it now that it has been bitten by a bug. Which may be dangerous.",
      why: "Ветеринар видит у щенка температуру и укус насекомого: щенок отказывается от еды и не играет из-за укуса.",
      trap: "Вариант 1: щенок не хочет играть, но причина — не скука: хозяин с детьми много гулял с ним. Вариант 2: он отказывается от еды, но это следствие болезни, а не её причина; о том, что щенок съел что-то не то, в записи не говорится.",
    },
    4: {
      proof:
        "I prefer fiction. Especially in French. It’s fun and good for learning… Do you learn French at school? — Yes. I’m good at it.",
      why: "Энн изучает французский в школе, хорошо его знает и даже пишет стихи на нём. Вопрос о языке, на котором она говорит сейчас.",
      trap: "Вариант 1: испанский она только начнёт изучать со следующей недели. Вариант 2: итальянский она предпочла бы, но в группе нет мест, она его не изучает.",
    },
    13: {
      why: "В тексте нет информации о том, что обычно едят на обед Мила и Дани. Известно лишь, что у Милы в коробке была еда (сэндвич), а Дани что-то жевал. Слово usually (обычно) в тексте не подтверждено и не опровергнуто. Not stated.",
      trap: "Фраза Need help with your sandwich? создаёт впечатление, что сэндвичи у них обычное дело. Но это один день, а утверждение говорит про привычку.",
    },
    14: {
      proof: "Oh, I got it! All the fuss is about the project on extraordinary scientists, isn’t it? I’ve done it — easy job!",
      why: "Дани прямо говорит, что он уже сделал проект: I’ve done it. Утверждение, что он не завершил работу, противоречит тексту. Это False.",
      trap: "Проблемы с проектом у Милы: It’s all about the project… I haven’t written a line!",
    },
    15: {
      proof: "I like biology. But I can’t write about a biologist… Biology is a science.",
      why: "Мила говорит, что ей нравится биология, а Дани замечает: you don’t like physics. Значит, она предпочитает биологию физике. True.",
    },
    16: {
      proof: "Michurin? I’ve never heard the name.",
      why: "Услышав фамилию Мичурина, Мила говорит, что никогда её не слышала. До слов Дани она ничего не знала о его вкладе в науку. True.",
    },
    17: {
      proof: "He created more than 300 new varieties of fruit plants. His apples, pears, cherries and berries were stronger and more productive than the original plants.",
      why: "По информации, которую Мила нашла в интернете, Мичурин вывел сорта, более сильные и урожайные, чем исходные растения. Это и значит «создал лучшие версии». True.",
    },
    18: {
      why: "В тексте сказано, что Мичурин много работал с гибридизацией — скрещиванием видов. Но не говорится, что кто-то другой не пользовался этим методом. Информации нет, поэтому Not stated.",
      trap: "Слова no one except… делают утверждение категоричным. Если текст молчит, ответ Not stated, а не False.",
    },
    19: {
      proof: "Michurin didn’t go to any university,” he replied, “He studied and researched all by himself.",
      why: "Дани говорит обратное: Мичурин не учился в университете, а изучал всё сам. Утверждение противоречит тексту. False.",
    },
  },

  rows: {
    6: {
      proof: "From Scotland. I was born there and have lived all my life there.",
      why: "Страна рождения — Scotland. Респондент говорит, что родился там и всю жизнь там прожил.",
      trap: "Ireland и Wales назвал интервьюер, там побывал он сам, а не респондент.",
    },
    7: {
      proof: "The best season to visit Scotland is summer of course, though my favourite time there is spring.",
      why: "Любимое время года респондента — весна: spring. Слово summer называет лучший сезон для посещения, но это не его любимое.",
      trap: "Summer прозвучало первым, но сразу после though (хотя) звучит настоящий ответ: my favourite time there is spring.",
    },
    8: {
      proof: "It’s because of my job. I’m a gardener and spring is the most important time for me.",
      why: "Нынешняя работа респондента — gardener (садовник). Он ухаживает за садами в городе.",
      trap: "Surgeon, banker и top manager названы как другие профессии, которые оплачиваются лучше, это не его работа.",
    },
    9: {
      proof: "The job of a gardener is less well-paid… But I like it. I’m 70 already but I feel happy and optimistic…",
      why: "Респонденту уже 70 лет, число записывается буквами: seventy.",
      trap: "Цифра 70 не принимается: по правилам числа в таблицу пишут буквами.",
    },
    10: {
      proof: "If you mean a hobby, in my case it’s certainly fishing.",
      why: "Хобби респондента — рыбалка (fishing). Он часто покупает удочки, но редко ловит много рыбы.",
      trap: "Singing, painting, collecting minerals — предположения интервьюера. Садоводство (gardening) — его работа, а не хобби.",
    },
    11: {
      proof: "My favourite dish is the pies my wife bakes.",
      why: "Любимое блюдо — пироги, которые печёт жена. В ключе допустимы pie и pies.",
      trap: "Fish упомянута как улов, который респондент почти никогда не приносит, но не как любимая еда.",
    },
  },

  gaps: {
    20: {
      why: "One of ___: после предлога of нужно местоимение в объектном падеже. Речь о книгах (books), поэтому они → them.",
      trap: "Форма they стоит только на месте подлежащего. Their — притяжательное и перед of не подходит.",
    },
    21: {
      why: "Нил был у Тины на выходных, пока родители в отпуске: временное действие в определённый период прошлого. Past Continuous: was staying. Past Simple stayed тоже принимается.",
      trap: "Форма is staying — настоящее время, а рассказ ведётся в прошлом. Форма were staying не согласуется с he.",
    },
    22: {
      why: "I was into alien stories: множественное число, потому что речь о многих историях. Story → stories: y после согласной меняется на ies.",
      trap: "Форма storys неверна: так образуется множественное число только у слов с гласной перед y (day → days). Форма story в единственном числе не подходит к слову into.",
    },
    23: {
      why: "One day, I even drew…: Past Simple рассказа о детстве. Draw — неправильный глагол: draw – drew – drawn.",
      trap: "Drawed и drawn неверны: третья форма drawn нужна только с have или в пассиве.",
    },
    24: {
      why: "My ___ birthday: перед существительным нужно порядковое числительное. Nine → ninth (девятый день рождения): буква e перед -th отпадает.",
      trap: "Форма nineth неверна: пишется ninth. Количественное nine означало бы «девять дней рождения».",
    },
    25: {
      why: "Нил рассказывает о прошлом и вспоминает, что сказал родителям: I told my parents that the aliens would come. Будущее в прошедшем: would + глагол.",
      trap: "Форма will come не согласуется с told: после прошедшего времени нужно would. Форма came говорит, что пришельцы уже пришли.",
    },
    26: {
      why: "He didn’t want to hurt Tina’s feelings again: отрицание в Past Simple — did not + want. Слово дано с NOT, ответ из двух слов.",
      trap: "Ответ wanted без not противоположен по смыслу. Форма did not wanted неверна: после did глагол без -ed.",
    },
    27: {
      why: "Ученые ищут знаки жизни уже давно (have been looking), и до сих пор ничего не нашли: Present Perfect с yet. Отрицание: haven’t found.",
      trap: "Past Simple didn’t find с yet не употребляется. Форма hasn’t found не согласуется со they.",
    },
    28: {
      why: "Maybe they are looking at us right now: действие происходит в момент речи (right now), поэтому Present Continuous.",
      trap: "Present Simple look означало бы привычку. Форма is looking не согласуется с they.",
    },
    29: {
      why: "One of the most ___ places: нужно прилагательное, приставка un- меняет значение на противоположное: usual → unusual («необычный»).",
      trap: "Usual означало бы «обычный», что не соответствует смыслу рекламного текста. Форма unusually — наречие, а перед существительным нужно прилагательное.",
    },
    30: {
      why: "The ___ of the region: после артикля нужно существительное. Populate → population («население»).",
      trap: "Popular означает «популярный», а не «жители». Populated — прилагательное «населённый», после артикля The оно не подходит.",
    },
    31: {
      why: "Volcanoes are active and dangerous: после and стоит прилагательное. Danger → dangerous.",
      trap: "Danger — существительное, оно не соединяется с active союзом and как однородный член. Форма dangerously — наречие.",
    },
    32: {
      why: "Guides help each ___ feel comfortable: после each существительное в единственном числе. Visit → visitor («посетитель»).",
      trap: "Visitors неверно после each (должно быть единственное число). Visiting — форма глагола, а не слово, обозначающее человека.",
    },
    33: {
      why: "Not only enjoyable but ___, too: параллельная конструкция, нужно прилагательное, как enjoyable. Education → educational («познавательный»).",
      trap: "Education — существительное: оно не может стоять рядом с enjoyable как однородный член. Форма educationally — наречие.",
    },
    34: {
      why: "The guides ___ highlight: слово определяет глагол highlight, поэтому нужно наречие. Proud → proudly («с гордостью»).",
      trap: "Proud — прилагательное: оно может определять существительное (proud guides), но не глагол. Pride — существительное.",
    },
  },

  matching5: {
    A: {
      proof: "Like my mother’s class, we have a special day at the end of the month when we wish happy birthday to our classmates… Before the New Year, we write our New Year Resolutions and display them on the walls in the classroom.",
      why: "Говорящая рассказывает о том, что передаётся в её школе из поколения в поколение: день рождения месяца и новогодние обещания. Рубрика 4, School traditions.",
      trap: "Рубрика 5 лишняя: поздравления с днём рождения упомянуты, но это не вечеринка.",
    },
    B: {
      proof: "From the beginning of the academic year, I start thinking about the holidays. We have Christmas, Easter and summer holidays.",
      why: "Весь рассказ о каникулах: рождественских, пасхальных и летних. Рубрика 6, School vacations.",
      trap: "Рубрика 5: о вечеринках нет ни слова, а фраза lots of fun and presents относится к Рождеству.",
    },
    C: {
      proof: "My new classmates welcomed me very warmly. They were really nice and helpful… I hope our friendship will not end when we finish school.",
      why: "Говорящая рассказывает, как после перехода в новую школу нашла друзей-одноклассников. Рубрика 3, School friends.",
      trap: "Рубрика 2: поездки на велосипеде и игры в парке происходят вне школы, но это рассказ о дружбе, а не о кружках.",
    },
    D: {
      proof: "There are several laws that we observe — we should respect our teachers… Only the students can enter the building… we ask our teacher for permission.",
      why: "Говорящий перечисляет, что можно и нельзя в школе: уважать учителей, не приводить посторонних без разрешения. Рубрика 1, School rules.",
    },
    E: {
      proof: "We enjoy sports games in our playground and our school theatre. We also have a dance group…",
      why: "Говорящая рассказывает о спортивных играх, театре и танцевальной группе, где можно найти хобби после уроков. Рубрика 2, After-school activities.",
      trap: "Рубрика 5: школьные вечеринки упомянуты как место выступления танцоров, но они не главная тема.",
    },
  },

  matching12: {
    A: {
      proof: "Penguins are among the most unusual birds on the Earth because they cannot fly, yet they are excellent swimmers.",
      why: "Текст объясняет, чем пингвины необычны среди птиц: не летают, но прекрасно плавают, птенцы вылупляются в ледяном мире. Вопрос 2.",
      trap: "Вопрос 1: зоопарк упомянут, но это не естественная среда обитания. Вопрос 3: рост птенцов не описан, поэтому он лишний.",
    },
    B: {
      proof: "In the water, they may be hunted by leopard seals, sharks, and killer whales. On the ice, eggs and chicks are sometimes attacked by large birds such as skuas.",
      why: "В тексте перечислены враги пингвинов: морские леопарды, акулы, косатки, поморники. Вопрос 5.",
    },
    C: {
      proof: "It’s very difficult to keep penguins in captivity… in many countries, people are not allowed to own penguins.",
      why: "Пингвинов трудно содержать дома: нужны бассейны, холод и много рыбы, а во многих странах они защищены законом. Значит, пингвин не может быть удобным домашним животным. Вопрос 7.",
      trap: "Вопрос 6: фраза protected by law есть и здесь, но вопрос о том, находятся ли пингвины под угрозой, отвечает текст F.",
    },
    D: {
      proof: "Different species live in different climates, from the icy shores of Antarctica to the warmer coasts of Africa and South America… In nature, penguins are found only in the Southern Hemisphere.",
      why: "Текст показывает, где живут пингвины: у океана в Южном полушарии, от Антарктиды до Африки и Галапагосов. Вопрос 1.",
    },
    E: {
      proof: "They are skilled hunters that dive deep underwater in search of fish, squid, and krill… This enables penguins to survive mainly on seafood.",
      why: "Основная пища пингвинов — рыба, кальмары и криль, то есть морепродукты. Вопрос 4.",
      trap: "Вопрос 5: слова hunters и prey могут сбить, но речь о том, на кого охотятся пингвины, а не о том, кто охотится на них.",
    },
    F: {
      proof: "Many penguins are now considered endangered and need human protection.",
      why: "Учёные обеспокоены: загрязнение, климат и перелов рыбы делают многие виды исчезающими. Вопрос 6.",
    },
  },

  writing: {
    sample:
      "Dear Julia,\n\nThanks for your email! I was glad to hear from you.\n\nYou asked about my typical school day. I get up at seven, and lessons start at half past eight. We usually have six lessons, and after school I have lunch at home and rest a little.\n\nMy homework takes me about two hours. Maths and physics need more time, while English and literature are quick to do.\n\nIn my free time I like cycling and meeting my friends. At the weekend we often go to the cinema or play football in the park. It helps me relax after a busy week.\n\nWrite back soon!\n\nBest wishes,\nAnna",
    templateSample:
      "Dear Julia,\n\nThank you for your recent message. I was very glad to hear from you again!\n\nAs for your questions, my typical school day is quite busy: I get up at seven, have six or seven lessons and then lunch and some rest. I usually spend about two hours on my homework, but sometimes it takes longer, especially before tests.\n\nIn my free time I enjoy listening to music and playing computer games. At the weekend I like going for walks with my friends, and sometimes we go to the cinema.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nAlina",
  },

  speaking: {
    hardWords: [
      { word: "glamping", tip: "/ˈɡlæmpɪŋ/ — «ГЛЭМ-пинг», ударение на первый слог" },
      { word: "glamorous", tip: "/ˈɡlæmərəs/ — «ГЛЭ-мэ-рэс», три слога" },
      { word: "camping", tip: "/ˈkæmpɪŋ/ — «КЭМ-пинг»" },
      { word: "comfortable", tip: "/ˈkʌmftəbl/ — «КАМФ-тэбл», в середине гласные не читаются" },
      { word: "appeared", tip: "/əˈpɪəd/ — «э-ПИЭД»" },
      { word: "dictionaries", tip: "/ˈdɪkʃənriz/ — «ДИК-шэн-риз»" },
      { word: "2016", tip: "twenty sixteen — год читают парами" },
      { word: "holidaymaker", tip: "/ˈhɒlədeɪmeɪkə/ — ударение на первый слог" },
      { word: "explorer", tip: "/ɪkˈsplɔːrə/ — ударение на второй слог" },
      { word: "sailing", tip: "/ˈseɪlɪŋ/ — «СЕЙ-линг»" },
      { word: "climbing", tip: "/ˈklaɪmɪŋ/ — буква b не читается" },
      { word: "cosy", tip: "/ˈkəʊzi/ — «КОУ-зи»" },
      { word: "cottage", tip: "/ˈkɒtɪdʒ/ — «КО-тидж», окончание -age звучит как [idʒ]" },
      { word: "Wi-Fi", tip: "/ˈwaɪfaɪ/ — «УАЙ-фай»" },
      { word: "400", tip: "four hundred" },
    ],
    task2Samples: [
      "I usually have six lessons a day. On Fridays I have only five, so it’s my favourite day of the week.",
      "My favourite subject is English. I like it because I can talk to people from other countries and watch films without translation.",
      "I’m not very fond of physics. The formulas seem difficult to me, and I find it hard to understand the experiments.",
      "At school we play football, volleyball and basketball. We also have gymnastics classes, and some students go to the swimming club.",
      "It usually takes me about two hours to do my homework. On days with maths and physics it can take even longer.",
      "I would recommend making a plan and starting your homework right after lunch. It’s also a good idea to turn off your phone, because it distracts you.",
    ],
    task3Sample:
      "I’d like to tell you about my hometown.\nMy hometown is famous for its old centre and the river that runs through it. Every year many tourists come here to see the ancient cathedral and the museums.\nI think the town looks most beautiful in autumn. The parks are full of yellow and red leaves, and the weather is usually warm and sunny.\nMy favourite place is the embankment. I often go for a walk there with my friends, and in the evening you can watch the sunset over the water. It is calm and very romantic.\nAs for my attitude to my hometown, I love it very much. I was born here, and I feel at home in this place.\nThat’s all I wanted to say about my hometown.",
  },
};
