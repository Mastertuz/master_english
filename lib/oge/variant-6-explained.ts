import type { ExplainedData } from "./explain";

/**
 * Разбор варианта 6: пояснения к каждому ответу письменной части, образцы письма и устных ответов.
 * Условия и ключи — в variant-6.ts, это издание книги без пояснений.
 */
export const variant6Explained: ExplainedData = {
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. К каждому ответу есть разбор; запись озвучена нейросетевым голосом",

  rules: {
    "20": "Past Simple — действие в прошлом, подсказка Yesterday. Глагол try: к нему добавляется -ed с заменой y на i (после согласной): try → tried, study → studied, но play → played.",
    "21": "После глагола expect с дополнением и инфинитивом (expected him to say) нужно местоимение в объектном падеже: he → him. Конструкция «сложное дополнение»: expect somebody to do something.",
    "22": "Past Simple, отрицание: did not (didn’t) + глагол в начальной форме. Слово дано с NOT, поэтому ответ из двух слов: did not understand или didn’t understand.",
    "23": "Present Simple, общее утверждение о мире: There is no such job. Конструкция there is / there are согласуется со следующим существительным: job (единственное число) → there is.",
    "24": "Present Simple, третье лицо единственного числа: к глаголу добавляется -s. Подлежащее it, поэтому exists. Ответ — «она существует»: поправка брата.",
    "25": "Сравнительная степень (comparative) многосложных прилагательных образуется с more: difficult → more difficult. После much and перед than нужна сравнительная форма. Формы difficulter не бывает.",
    "26": "Согласование времён в косвенном вопросе: главное предложение в прошедшем (explained), значит и в придаточном прошедшее: what the job included. Present Simple includes здесь не подходит.",
    "27": "Условное предложение первого типа: если + Present Simple (you eat), в главной части will + глагол: you will get sick. Ответ: will get или сокращение ’ll get.",
    "28": "Present Perfect (have / has + V3) — результат действия важен сейчас: I’ve read 56 job market reviews. Now I know a lot. Read — неправильный глагол: read – read – read (форма та же, произносится [red]).",
    "29": "Суффикс -ful образует прилагательные от существительных: beauty → beautiful (y → i), care → careful. После one of the most нужна форма прилагательного (превосходная степень): one of the most beautiful cities.",
    "30": "Суффикс -able образует прилагательные от глаголов: suit → suitable («подходящий»). После was стоит прилагательное: the Neva was suitable for navigation.",
    "31": "Суффикс -ment образует существительные от глаголов: develop → development, improve → improvement. После прилагательного economic и перед of нужно существительное.",
    "32": "Суффикс -ive образует прилагательные от существительных: expense → expensive («дорогой»). Сравнение convenient and less expensive: после less нужно прилагательное.",
    "33": "Суффикс -ous образует прилагательные от существительных: fame → famous («известный»), danger → dangerous. После was нужно прилагательное: was famous long before…",
    "34": "Названия национальностей образуются от названия страны: Russia → Russian. Прилагательные национальности пишутся с заглавной буквы: the Russian Army.",
  },

  choice: {
    1: {
      proof:
        "All you need to have with you is some anti-mosquito spray and a coat in case the weather changes.",
      why: "Участники пикника должны взять с собой спрей от комаров (anti-mosquito spray). Остальное — еду, воду и всё для игр — привезут организаторы.",
      trap: "Вариант 1 (food and drinks) и вариант 3 (board games): всё это доставят организаторы, о чём говорится в начале: please, don’t worry about that.",
    },
    2: {
      proof:
        "My friend, Nancy, is coming to get her computer back… Could you give her the computer, please?",
      why: "Девочка просит маму отдать компьютер подруге Нэнси, потому что сама не успеет домой.",
      trap: "Вариант 1: Нэнси купила компьютер вчера сама, никто не просит покупать новый. Вариант 2: убраться в комнате девочка обещает сама, когда вернётся.",
    },
    3: {
      proof:
        "My mum and I prefer trains. But it would take too long and the holidays are short. To save time, we are travelling by air.",
      why: "Эми с мамой любят поезда, но каникулы короткие, и они летят на самолёте: To save time, we are travelling by air.",
      trap: "Вариант 2: поезда Эми предпочитает, но не едет. Вариант 3: на машине любит ездить Том, а Том сам замечает, что для Эми это не вариант.",
    },
    4: {
      proof:
        "Actually, I wanted to find a job here. A friend of mine told me they’ve got a vacancy for a columnist at their journal.",
      why: "Эмма приехала в Рим искать работу: она хотела получить место колумниста в журнале.",
      trap: "Вариант 1: английский в Риме преподаёт Пол, а не Эмма. Вариант 2: подруга лишь рассказала о вакансии, к ней Эмма не приезжала.",
    },
    13: {
      proof: "That is why the city was sometimes called The Jewel Box.",
      why: "Дрезден называли Шкатулкой с драгоценностями из-за бесценной коллекции картин, которую там хранили, а не из-за производства и продажи украшений. Утверждение противоречит тексту. False.",
      trap: "Слово jewellery создаёт ложную связь: nickname объясняется богатством коллекции, а не торговлей.",
    },
    14: {
      proof:
        "German and Russian archaeologists, sculptors and artists worked hard to return the city to its historical look.",
      why: "Немецкие и российские специалисты вместе восстанавливали город. True.",
    },
    15: {
      why: "О том, был ли рядом с галереей аэропорт, в тексте не сказано. Эвакуация картин происходила по железной дороге (by railway). Not stated.",
      trap: "Слово railway подталкивает к мысли о транспорте вообще, но об аэропорте ни слова.",
    },
    16: {
      proof:
        "The woman was sure that the collection wasn’t evacuated, it was hidden somewhere in the building of the Dresden Academy of Fine Arts.",
      why: "Хранительница была уверена, что коллекцию не вывозили, а спрятали в здании Академии художеств. Утверждение противоречит. False.",
      trap: "Версия об эвакуации по железной дороге принадлежит сотрудникам галереи, а не хранительнице.",
    },
    17: {
      proof:
        "The map was hard to read because of strange letters and symbols but soon the searchers solved the riddle.",
      why: "Карту было трудно прочитать, но поисковики быстро разгадали шифр. Они смогли расшифровать карту. True.",
    },
    18: {
      proof:
        "After removing the mines, the soldiers found the priceless paintings in the underground room.",
      why: "Картины нашли в подземном помещении в заброшенном туннеле, а не в ближайшем городе. Утверждение противоречит тексту. False.",
      trap: "Фраза nearby area в тексте относится к местам, которые обозначали буквы на карте, а не к городу.",
    },
    19: {
      proof:
        "In 1955 the whole collection was returned to Dresden where it has been displayed up to the present time.",
      why: "Коллекцию вернули в Дрезден в 1955 году, и она выставлена там до сих пор. True.",
    },
  },

  rows: {
    6: {
      proof:
        "I’m fifteen and I’m old enough to understand that education is important.",
      why: "Школьнику пятнадцать лет. Число записывается буквами: fifteen.",
      trap: "Цифра 15 не принимается: по правилам числа в таблицу пишут буквами.",
    },
    7: {
      proof:
        "My next exam is in Chemistry and it’s going to be tough… It’s the most challenging subject for me.",
      why: "Самый трудный предмет — Chemistry: так говорит сам респондент.",
      trap: "Maths и English уже сданы, и они were not difficult.",
    },
    8: {
      proof: "Yes. I want to be a surgeon.",
      why: "Респондент хочет стать хирургом: surgeon. В ключе допустим и вариант doctor.",
    },
    9: {
      proof:
        "Painting. I like it and I’m pretty good at it. Some of my paintings are displayed at our school art exhibition.",
      why: "Хобби респондента — рисование: painting. Его работы выставлены на школьной выставке.",
      trap: "Collecting coins — предположение интервьюера. Музыкой он не занимается: I don’t care for music.",
    },
    10: {
      proof: "I regularly go jogging. I got this habit from my dad.",
      why: "Регулярное спортивное занятие респондента — jogging, бег трусцой: привычка от отца.",
    },
    11: {
      proof:
        "Both my parents come from Canada and I was born there but since primary school we’ve been moving a lot.",
      why: "Респондент родился в Канаде: Canada. Родители тоже оттуда.",
      trap: "France, Germany и Egypt — страны, где семья жила потом. Вопрос о стране рождения.",
    },
  },

  gaps: {
    20: {
      why: "Yesterday, I ___ to find out…: действие в прошлом, Past Simple. Try → tried: y после согласной заменяется на ied.",
      trap: "Форма trid неверна: пишется tried. Форма tryed — орфографическая ошибка. Форма try без -ed относится к настоящему.",
    },
    21: {
      why: "I expected ___ to say something: после expect с инфинитивом нужно дополнение, объектный падеж. He → him: «ожидал, что он скажет».",
      trap: "Форма he — подлежащее, после expected в такой конструкции стоит him. Форма his — притяжательное, после глагола в этом значении не подходит.",
    },
    22: {
      why: "“What?” I didn’t understand him at first: отрицание в Past Simple, did not + understand. Слово дано с NOT, поэтому ответ из двух слов.",
      trap: "Форма understood без not противоположна по смыслу. Форма did not understood неверна: после did глагол без изменений.",
    },
    23: {
      why: "There is no such job as an ice cream taster: Present Simple, общее утверждение. There is + job (единственное число).",
      trap: "Форма are требует множественного числа. Форма was поставила бы рассказ в прошлое, но спор идёт о том, что существует сейчас.",
    },
    24: {
      why: "It exists: Present Simple, подлежащее it — третье лицо, глагол получает -s. «Нет, она существует.»",
      trap: "Форма exist без -s не согласуется с it. Форма existing без is не образует сказуемое.",
    },
    25: {
      why: "It is much more difficult than most people think: сравнение с than, многосложное прилагательное, more difficult. Much усиливает сравнение.",
      trap: "Форма difficulter неверна для длинных прилагательных. Форма most difficult — превосходная степень, она не употребляется с than.",
    },
    26: {
      why: "The kid explained what the job included: главная часть в Past Simple (explained), поэтому и в придаточной — included.",
      trap: "Форма includes — настоящее время, а повествование в прошедшем. Форма including — причастие без вспомогательного глагола.",
    },
    27: {
      why: "Don’t you think you will get sick if you eat so much ice cream?: условное предложение первого типа, реальное условие, результат — will get.",
      trap: "Форма would get — нереальное условие, но после eat (Present Simple) нужно будущее. Форма get без will не выражает будущее.",
    },
    28: {
      why: "I have read 56 job market reviews. Now I know a lot…: Present Perfect, результат (знаю сейчас) связан с настоящим. Have read / ’ve read.",
      trap: "Форма read без have выглядит как Past Simple, но подсказка Now I know показывает связь с настоящим, поэтому нужно Present Perfect. Форма have readed неверна.",
    },
    29: {
      why: "One of the most beautiful cities: прилагательное в превосходной степени после the most. Beauty → beautiful (y меняется на i).",
      trap: "Beauty — существительное, перед cities нужно прилагательное. Форма beautifully — наречие.",
    },
    30: {
      why: "The Neva was suitable for navigation: после was нужно прилагательное. Suit → suitable («подходящая»).",
      trap: "Suit — глагол «подходить» или существительное «костюм». Форма suiting не употребляется в таком значении.",
    },
    31: {
      why: "The economic development of the country: после прилагательного economic нужно существительное. Develop → development («развитие»).",
      trap: "Develop — глагол, перед of нужно существительное. Developing — причастие: developing country, но не развитие страны.",
    },
    32: {
      why: "More convenient and less expensive than by land: после less нужно прилагательное, параллельное convenient. Expense → expensive.",
      trap: "Expense — существительное «расход», после less оно не подходит. Форма expensively — наречие.",
    },
    33: {
      why: "The Neva River was famous long before the city was founded: после was прилагательное. Fame → famous («известная»).",
      trap: "Fame — существительное «слава», сказуемое с was требует прилагательного. Форма famously — наречие.",
    },
    34: {
      why: "The Russian Army led by Prince Alexander: перед существительным Army нужно прилагательное, образованное от названия страны. Russia → Russian, с заглавной буквы.",
      trap: "Russia — название страны, а не прилагательное. Форма russian со строчной буквы — орфографическая ошибка.",
    },
  },

  matching5: {
    A: {
      proof:
        "The main reason why people are still interested in buying it is the rumours that my great-grandfather hid some treasure somewhere in the house… There’s a belief that the treasure can only reveal itself to a member of the family.",
      why: "Говорящий рассказывает старую семейную легенду о спрятанном в доме кладе. Рубрика 3, Urban legend.",
    },
    B: {
      proof:
        "It is eco-friendly and independent in terms of energy supply… my uncle filled it with different electronic household devices… all the household chores are performed by clever electronic robot installations.",
      why: "Говорящая описывает дом дяди, где бытовые дела выполняют электронные устройства. Рубрика 1, Smart house.",
      trap: "Цветы и сад упомянуты как увлечение дяди, но они не главная мысль.",
    },
    C: {
      proof:
        "I was offered a job in the city, and commuting every day was absolutely exhausting… Now I live in a small flat in the city and my treasure of a house is left unattended.",
      why: "Говорящий выбирает между домом в деревне и работой в городе: переехал в город, а дом в деревне собирается продавать. Рубрика 5, City or countryside.",
    },
    D: {
      proof:
        "Inside you can see furniture made from single logs of wood… I bought all the other decor to match this furniture. That’s why my house looks like a museum.",
      why: "Говорящий рассказывает, как обставил дом: старинная мебель из цельных брёвен и подходящий к ней декор. Рубрика 6, Interior design.",
      trap: "Рубрика 5: говорящий тоже переехал в деревню, но главная тема — оформление дома, а не выбор места жизни.",
    },
    E: {
      proof:
        "Wherever I move, I drag this old armchair with me. It’s so cosy that it makes me feel at home anywhere.",
      why: "Говорящая рассказывает о любимом кресле, которое она возит с собой повсюду. Рубрика 2, Favourite piece of furniture.",
      trap: "Рубрика 4 лишняя: дома для отпуска ни один из говорящих не обсуждает.",
    },
  },

  matching12: {
    A: {
      proof:
        "The Arctic life is characterized by short summers and long, cold winters, with temperatures well below freezing.",
      why: "Текст описывает климат Арктики: полярный день и ночь по полгода, короткое лето, долгая холодная зима. Вопрос 4.",
    },
    B: {
      proof:
        "Due to climate change, the ice covering has been reducing dramatically… the temperatures in the Arctic continue to rise.",
      why: "Из-за потепления ледяной покров быстро сокращается, и льды становятся тоньше. Вопрос 7.",
      trap: "Вопрос 6: в тексте F тоже сказано про global warming, но F отвечает на вопрос о защите животных, а B о том, как потепление влияет на Арктику.",
    },
    C: {
      proof:
        "It would be logical to suppose that the Arctic comes from the Greek word Arktos, which means bear… the name refers to two groups of stars — Little Bear and Great Bear.",
      why: "Текст объясняет значение названия: оно связано со звёздными группами Малая и Большая Медведицы. Вопрос 1.",
    },
    D: {
      proof:
        "Lots of oil, gas and minerals, such as copper, nickel and zinc have been extracted.",
      why: "В Арктике добывают нефть, газ и минералы: медь, никель, цинк. Вопрос 5.",
    },
    E: {
      proof:
        "Antarctica is in the Southern hemisphere and it’s a continent… the Arctic is at the cap of the Northern hemisphere… the frozen ocean.",
      why: "Арктика находится на вершине Северного полушария и представляет собой замёрзший океан. Вопрос 3.",
    },
    F: {
      proof:
        "They are perfectly adapted to the harsh living conditions but are helpless to fight against people’s expanding activities and global warming. Recently, the Russian Arctic National Park was created.",
      why: "Животные беззащитны перед деятельностью человека, и для них создан национальный парк. Значит, фауне нужна защита. Вопрос 6.",
      trap: "Вопрос 2 (символ Арктики) остался без ответа: ни в одном тексте символ не назван.",
    },
  },

  writing: {
    sample:
      "Dear Duncan,\n\nThanks for your email! I think the article you read is very useful.\n\nI don’t have much free time, because I have a lot of homework and I go to a music school twice a week. So I try to plan my day carefully. I think a good plan helps a lot.\n\nWhen I’m free, I usually read books, ride my bike or meet my friends. At weekends we often play basketball in the yard.\n\nOne day I would like to try rock climbing. I think it’s exciting, and it can make me stronger and braver.\n\nWrite back soon!\n\nBest wishes,\nAnna",
    templateSample:
      "Dear Duncan,\n\nThank you for your recent message. I was very glad to hear from you again!\n\nAs for your questions, I think I have enough free time, because I do my homework quickly. Usually I have two or three free hours every day. I spend them playing football with my friends, watching films and chatting online.\n\nOne day I would like to try diving. I have never seen the sea, so it would be great to swim among fish and corals. I think it’s a dream of many people. It must be a great adventure.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nIvan",
  },

  speaking: {
    hardWords: [
      {
        word: "basketball",
        tip: "/ˈbɑːskɪtbɔːl/ — «БАС-кит-бол», ударение на первый слог",
      },
      { word: "popular", tip: "/ˈpɒpjələ/ — «ПО-пью-лэ»" },
      { word: "planet", tip: "/ˈplænɪt/ — «ПЛЭ-нит»" },
      {
        word: "thousands",
        tip: "/ˈθaʊzndz/ — «САУ-зндз», th как в слове think",
      },
      { word: "millions", tip: "/ˈmɪljənz/ — «МИЛ-йэнз»" },
      { word: "exciting", tip: "/ɪkˈsaɪtɪŋ/ — «ик-САЙ-тинг»" },
      { word: "opposing", tip: "/əˈpəʊzɪŋ/ — «э-ПОУ-зинг»" },
      {
        word: "court",
        tip: "/kɔːt/ — «КОТ», долгий звук, буква r не читается",
      },
      { word: "1891", tip: "eighteen ninety-one — год читают парами" },
      { word: "invented", tip: "/ɪnˈventɪd/ — «ин-ВЭН-тид»" },
      { word: "teacher", tip: "/ˈtiːtʃə/ — «ТИ-чэ»" },
      { word: "active", tip: "/ˈæktɪv/ — «ЭК-тив»" },
      { word: "dynamic", tip: "/daɪˈnæmɪk/ — «дай-НЭ-мик»" },
      { word: "fruit", tip: "/fruːt/ — «ФРУТ», долгий звук [uː]" },
      { word: "baskets", tip: "/ˈbɑːskɪts/ — «БАС-китс»" },
    ],
    task2Samples: [
      "I’m fifteen years old. I’m in the ninth grade and I’m going to take the state exams this year.",
      "At school we have autumn, winter, spring and summer holidays. The summer holidays are the longest: they last about three months.",
      "My favourite holidays are the summer ones. I like them because I can sleep longer, go to the seaside with my family and meet my friends every day.",
      "When I’m on holiday I spend about three or four hours online a day. I chat with my friends, watch videos and sometimes play computer games.",
      "I usually go to my grandparents’ village for two weeks, ride a bike, swim in the river and help my grandfather in the garden. The rest of the time I spend with friends.",
      "I would recommend finding a hobby, for example, drawing or playing a musical instrument. It is also a good idea to go for walks or to do sport with friends.",
    ],
    task3Sample:
      "I’d like to tell you about my career choice.\nNowadays many teenagers dream of becoming programmers, bloggers, doctors or designers. These jobs are well paid and interesting.\nWhen I was a child, I wanted to be a pilot. I liked planes and dreamed of travelling all over the world.\nI think my parents and teachers can help me choose a career. They know me well, and my school teacher can give me good advice about universities.\nAs for freelance jobs, I think they are great. A freelancer can work at home, plan his own day and choose interesting projects. But it needs a lot of self-discipline.\nThat’s all I wanted to say about my career choice.",
  },
};
