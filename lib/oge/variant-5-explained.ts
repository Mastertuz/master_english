import type { ExplainedData } from "./explain";

/**
 * Разбор варианта 5: пояснения к каждому ответу письменной части, образцы письма и устных ответов.
 * Условия и ключи — в variant-5.ts, это издание книги без пояснений.
 */
export const variant5Explained: ExplainedData = {
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. К каждому ответу есть разбор; запись озвучена нейросетевым голосом",

  rules: {
    "20": "Притяжательные местоимения-прилагательные стоят перед существительным: my, your, his, her, its, our, their. Перед calls нужно слово, которое показывает, чьи звонки: she → her. Форма she — подлежащее, hers употребляется без существительного.",
    "21": "Past Continuous (was / were + -ing) показывает процесс, который шёл в определённый момент прошлого: когда Сара звонила, Джеймс сидел за столом и читал. Подлежащее James — единственное число, значит was sitting.",
    "22": "Past Simple, отрицание: did not (didn’t) + глагол в начальной форме. Слово дано с NOT, поэтому частица not входит в ответ: did not notice или didn’t notice. Форма noticed без not противоположна по смыслу.",
    "23": "Слова на -man образуют множественное число заменой -man на -men: fisherman → fishermen, policeman → policemen. Форма fishermans неверна. После of в значении «деревня рыбаков» нужно множественное число.",
    "24": "Present Simple: Sometimes — признак повторяющегося действия. Конструкция there is / there are согласуется со следующим существительным: connection (единственное число) → there is. Неисчисляемые существительные тоже идут с is.",
    "25": "Present Perfect Continuous (have been + -ing) или Present Perfect (have + V3) — действие началось в прошлом и продолжается сейчас: for ten years now. Подлежащее grandparents — множественное число, значит have been keeping / have kept.",
    "26": "Страдательный залог: Past Simple Passive — was / were + V3. Last weekend — прошедшее время, а подлежащее I не знакомит, а его знакомят с королевой пчёл. Was introduced.",
    "27": "Превосходная степень (superlative) длинных прилагательных: the most + прилагательное. After the нужна превосходная форма: the most important bee in the hive. Слово important состоит из трёх слогов, поэтому -est не добавляется.",
    "28": "Условное предложение первого типа: if + Present Simple, will + глагол. If you come with me, you will see… — реальное условие в будущем. Ответ: will see или сокращение ’ll see.",
    "29": "Суффикс -er образует существительное, обозначающее человека: own → owner, teach → teacher. Pet owner — «владелец домашнего животного»; после any нужно существительное в единственном числе.",
    "30": "Суффикс -ly образует наречия от прилагательных: actual → actually («на самом деле»). Наречие определяет глагол say: what animals actually say.",
    "31": "Суффикс -ation образует существительные от глаголов: communicate → communication. Communication with animals — подлежащее придаточного предложения, поэтому нужно существительное.",
    "32": "Суффикс -ing образует от глагола существительное: mean → meaning («значение»), feel → feeling. После артикля the стоит существительное: the meaning of the sounds.",
    "33": "Приставка un- меняет значение на противоположное, суффикс -able образует прилагательное: believe → believable → unbelievable. После look нужно прилагательное: It may look unbelievable now.",
    "34": "Названия языков образуются от названия страны: Italy → Italian; такие слова пишутся с заглавной буквы. Ряд English, Russian, or Italian — однородные члены, все названия языков.",
  },

  choice: {
    1: {
      proof:
        "If you don’t feel confident about any subject from the science block, feel free to apply directly to the headteacher.",
      why: "Если ученик не уверен в предмете из научного блока (Science), нужно обратиться напрямую к директору (headteacher).",
      trap: "Вариант 1: секретарь договаривается о консультациях по языковым экзаменам. Вариант 3: учитель информатики помогает с экзаменами на компьютере.",
    },
    2: {
      proof:
        "Anyway, I can’t solve the maths problem from page 55. I’ve really tried hard but in vain. Call me back, please, so we can work it out together.",
      why: "Эмма просит Джейн помочь с задачей по математике со страницы 55: Maths.",
      trap: "Вариант 2: Пол сейчас на уроке веб-дизайна, поэтому не отвечает. Вариант 3: Элис готовится к конкурсу по литературе в библиотеке. Эмма хотела позвонить обоим, но не стала.",
    },
    3: {
      proof:
        "We are giving a concert here. We just want to make children a little bit happier and forget about their illnesses for a while.",
      why: "Джим пришёл в больницу в костюме, чтобы дать концерт и поднять настроение юным пациентам.",
      trap: "Вариант 1: в больнице лежит младший брат Бесс, а не Джима. Вариант 2: врача Джим не ищет, он идёт к администрации уточнить время концерта.",
    },
    4: {
      proof:
        "It’s not a question of the price. All the pictures displayed here are not for sale. They belong to the local museum.",
      why: "Ник объясняет, что картины выставлены в музее и не продаются. Значит, Лиза не может купить её, потому что это экспонат музея.",
      trap: "Вариант 1: Лиза спрашивает, не дорого ли, но Ник отвечает, что дело не в цене. Вариант 3: Лиза боится, что картину купит кто-то другой, но о продаже не сказано.",
    },
    13: {
      why: "Рассказчик вспоминает, что в детстве любил читать книги про сокровища (Treasure Island, King Solomon’s Mines). Мечтал ли он стать археологом, в тексте не сказано. Not stated.",
      trap: "Интерес к кладам в детстве не означает мечты о профессии археолога: об этом в тексте нет ни слова.",
    },
    14: {
      proof:
        "One of the most well-known discoveries is the treasure of Tutankhamun’s tomb, found in Egypt in 1922.",
      why: "Гробницу нашли в 1922 году. С тех пор прошло больше ста лет, так что утверждение верно. True.",
    },
    15: {
      proof:
        "Luckily, Tutankhamun’s tomb was found undamaged. Thieves had not got to it because the tomb was very well hidden.",
      why: "Грабители до гробницы не добрались, её нашли нетронутой. Утверждение, что часть сокровищ была украдена, противоречит тексту. False.",
      trap: "Фраза Many ancient Egyptian tombs had been robbed относится к другим гробницам, а не к гробнице Тутанхамона.",
    },
    16: {
      proof:
        "Among the treasures was the famous burial mask of Tutankhamun, made of solid gold and inlaid with precious stones.",
      why: "Знаменитая погребальная маска была среди сокровищ, найденных в гробнице. True.",
    },
    17: {
      proof:
        "The treasure of Tutankhamun’s tomb was discovered by Howard Carter and his team. Though they were British…",
      why: "Сокровища нашли Говард Картер и его команда, и текст говорит: they were British. True.",
    },
    18: {
      proof:
        "Though they were British, the government of the UK did not transport the findings to Britain.",
      why: "Правительство Великобритании не вывозило находки в Британию, так как в Египте был закон о том, что все клады принадлежат государству. Утверждение противоречит тексту. False.",
    },
    19: {
      proof:
        "GEM is a massive, modern museum near the pyramids, in Giza, Egypt.",
      why: "GEM — это огромный современный музей, а не государственная программа финансирования археологических проектов. Утверждение противоречит тексту. False.",
      trap: "Слово governmental не подтверждено текстом: GEM назван музеем, построенным для главных артефактов.",
    },
  },

  rows: {
    6: {
      proof: "No, I’m nineteen and I’ve got a job already.",
      why: "Респонденту девятнадцать лет. Число записывается буквами: nineteen.",
      trap: "Интервьюер думает, что собеседница ещё учится в школе или колледже, но она возражает. Цифра 19 не принимается: числа пишут буквами.",
    },
    7: {
      proof:
        "Today is my second working day in the hairdresser’s salon… you’ve just started your career as a hairdresser?",
      why: "Респондентка работает в парикмахерском салоне: hairdresser. Сегодня её второй рабочий день.",
    },
    8: {
      proof:
        "What language are you planning to start with? — Spanish. It’s widely spoken but it’s not as difficult as Chinese.",
      why: "Она собирается начать изучение испанского: Spanish. Китайский труднее, поэтому его она не выбирает.",
      trap: "Chinese называется как более сложный язык, а Chinese ladies и German girl — клиенты салона.",
    },
    9: {
      proof:
        "I don’t mind their soups and fish and noodles but all those are a bit too spicy for me. I prefer pasta.",
      why: "Любимое блюдо респондентки — pasta: она ест его чаще всего.",
      trap: "Soups, fish и noodles — китайские блюда, которые ей кажутся острыми. Ответ — то, что она любит больше всего.",
    },
    10: {
      proof:
        "We do the same on Wednesday. Because mum usually works on Fridays and Saturdays till late and Wednesday is her day off. I’ve asked for a day off on Wednesday too.",
      why: "Выходной день респондентки — Wednesday: так она сможет ходить с семьёй в ресторан.",
      trap: "Friday — день, когда в ресторан ходит семья интервьюера. Для респондентки это Wednesday.",
    },
    11: {
      proof:
        "Now I enjoy singing and I’m experimenting with different vocal techniques. So, we can say that I’ve taken up singing as a hobby.",
      why: "Нынешнее хобби — пение: singing. В ключе допустим и вариант vocal.",
      trap: "Drama Club и origami были раньше: But I don’t do either of them anymore.",
    },
  },

  gaps: {
    20: {
      why: "She didn’t like it when ___ calls were ignored: перед существительным calls нужно притяжательное прилагательное. Звонки Сары, she → her.",
      trap: "Форма she — подлежащее, перед существительным не ставится. Форма hers употребляется без существительного.",
    },
    21: {
      why: "James ___ at the desk reading something: описывается процесс, который шёл в тот момент. Past Continuous: was sitting.",
      trap: "Форма sat означала бы, что он сел, а не что находился в процессе. Форма is sitting — настоящее время, а рассказ в прошлом.",
    },
    22: {
      why: "He didn’t notice Sarah’s irritation: отрицание в Past Simple, did not + notice. Слово дано с NOT, поэтому ответ из двух слов.",
      trap: "Форма noticed без not противоположна по смыслу. Форма did not noticed неверна: после did глагол без -ed.",
    },
    23: {
      why: "A village of fishermen and beekeepers: множественное число, потому что в деревне живёт много рыбаков. Fisherman → fishermen, как man → men.",
      trap: "Форма fishermans неверна: слова на -man образуют множественное число через -men. Fisherman в единственном числе не подходит.",
    },
    24: {
      why: "Sometimes, there is no internet connection there: Present Simple, Sometimes указывает на повторяющуюся ситуацию. There is + connection (единственное число).",
      trap: "Форма are требует множественного числа. Форма was не подходит: рассказ о том, что бывает вообще, в настоящем времени.",
    },
    25: {
      why: "My grandparents have been keeping bees for ten years now: Present Perfect Continuous, действие началось 10 лет назад и продолжается. Have kept тоже принимается.",
      trap: "Простое keep (Present Simple) не подходит к for ten years. Форма has been keeping не согласуется с grandparents.",
    },
    26: {
      why: "I was introduced to the queen bee: «меня познакомили»: Past Simple Passive. Last weekend — прошедшее время.",
      trap: "Форма introduced без was означала бы, что я кого-то познакомил с королевой, а это противоположно смыслу.",
    },
    27: {
      why: "She’s the most important bee in the hive: превосходная степень, после the. Важное слово из трёх слогов: most important.",
      trap: "Форма more important — сравнительная степень, она нужна с than. Форма importantest неверна для длинного слова.",
    },
    28: {
      why: "If you come with me, you will see the bee kingdom: условное предложение первого типа, if + Present Simple, будущее в главной части. Will see / ’ll see.",
      trap: "Форма would see — нереальное условие. Форма see без will не передаёт будущее.",
    },
    29: {
      why: "Any pet owner can understand…: суффикс -er образует название человека. Own → owner («владелец»).",
      trap: "Own — глагол «владеть». Owned — причастие, owning — форма глагола, существительное нужно в роли подлежащего.",
    },
    30: {
      why: "Hear what animals actually say: слово определяет глагол say, поэтому нужно наречие. Actual → actually («на самом деле»).",
      trap: "Actual — прилагательное: оно определяет существительное, а не глагол. Actuality — существительное.",
    },
    31: {
      why: "That communication with animals will be possible: после that нужно подлежащее, существительное. Communicate → communication.",
      trap: "Communicate — глагол, он не может быть подлежащим. Communicating — форма глагола, а нужно существительное с суффиксом -ation.",
    },
    32: {
      why: "The meaning of the sounds: после артикля the нужно существительное. Mean → meaning («значение»).",
      trap: "Mean — глагол «значить»; Meaningful — «значимый», прилагательное, после the и перед of оно не подходит.",
    },
    33: {
      why: "It may look unbelievable now: после look нужно прилагательное. Believe → believable («правдоподобный») → unbelievable («невероятный»).",
      trap: "Believable означало бы «правдоподобно», что противоречит but in a few years… Форма unbelievably — наречие, а после look нужно прилагательное.",
    },
    34: {
      why: "Speaking English, Russian or Italian: названия языков. Italy → Italian, с заглавной буквы.",
      trap: "Italy — страна, а не язык. Форма italian без заглавной буквы — орфографическая ошибка: языки пишутся с большой буквы.",
    },
  },

  matching5: {
    A: {
      proof:
        "I do not believe a successful learning process is possible without tests and exams… the aim of the test or exam is not to punish you, but to show your progress.",
      why: "Говорящий объясняет, зачем нужны экзамены: показать успехи и слабые места. Рубрика 2, Why take exams.",
    },
    B: {
      proof:
        "It is important to get ready for a test or exam correctly. It means to use different techniques to revise the material, look at past papers or sample papers.",
      why: "Говорящая рассказывает, как правильно готовиться: разные приёмы повторения, пробные варианты и формат теста. Рубрика 3, How to prepare for exams.",
      trap: "Рубрика 5 лишняя: об очерёдности повторения материала в высказываниях нет ни слова.",
    },
    C: {
      proof:
        "It’s ok to feel nervous and anxious before an exam… have a walk before you get into the classroom — it’ll help you feel more relaxed.",
      why: "Говорящая даёт советы, как справиться с волнением: выспаться накануне, поставить два будильника, пройтись перед экзаменом. Рубрика 6, How to calm down.",
      trap: "Рубрика 3: советы относятся не к подготовке материала, а к поведению накануне и в день экзамена, чтобы успокоиться.",
    },
    D: {
      proof:
        "You should study in short spells, and change activities to get your brains to stay active. Let walks or sports activities interrupt your learning process.",
      why: "Говорящий объясняет, зачем нужны перерывы: непрерывная учёба снижает шансы на успех. Рубрика 4, Why have breaks.",
    },
    E: {
      proof:
        "Listen to the examiner very carefully and follow all their instructions. Before you start, look through the whole exam paper.",
      why: "Говорящая перечисляет, что делать во время экзамена: слушать экзаменатора, просмотреть работу, пропустить трудное. Рубрика 1, What to do in the exam classroom.",
    },
  },

  matching12: {
    A: {
      proof:
        "Many people think that the Sahara Desert is the biggest in the world and feel surprised to find out that it isn’t! Antarctica… is at the top of the list!",
      why: "Самая большая пустыня на планете — Антарктида, а не Сахара. Вопрос 2.",
    },
    B: {
      proof:
        "When lost, an average tourist can usually survive only a few days in a desert.",
      why: "Заблудившийся турист обычно выживает в пустыне лишь несколько дней. Вопрос 7.",
      trap: "Вопрос 4: oasis farmers упомянуты, но о том, как возникают оазисы, текст не говорит.",
    },
    C: {
      proof:
        "Strong temperature changes create winds that affect the rainfall system on our planet… dust from the Sahara helps the Amazon rainforests grow.",
      why: "Перепады температур создают ветры, влияющие на осадки, а пыль из Сахары питает леса Амазонки. Вопрос 3.",
    },
    D: {
      proof:
        "About one-third of the land of our planet is occupied by deserts.",
      why: "Пустыни занимают около трети суши. Вопрос 1.",
    },
    E: {
      proof:
        "Cutting down forests, keeping overgrazing animals, and agricultural mistakes can damage the soil and turn fertile land into dry areas.",
      why: "Вырубка лесов, перевыпас скота и ошибки в земледелии увеличивают пустыни. Вопрос 5.",
    },
    F: {
      proof:
        "Modern technology allows farmers to grow vegetables and fruit in some desert areas. Special irrigation systems bring water directly to plants.",
      why: "Современные системы орошения позволяют выращивать овощи и фрукты в некоторых пустынях. Вопрос 6.",
      trap: "Вопрос 4 остался без ответа: ни один текст не объясняет, как возникают оазисы.",
    },
  },

  writing: {
    sample:
      "Dear Jane,\n\nThanks for your email! Happy birthday! I’m glad you had a great time.\n\nI get presents not very often: on my birthday, at New Year and sometimes for good marks at school.\n\nI think I prefer giving presents. I like choosing something special for my friends and seeing how happy they are when they open the box.\n\nThe best present I’ve ever got is a telescope from my parents. I got it on my twelfth birthday, and now I look at the stars with my father every clear evening. It was the best day of my life.\n\nWrite back soon!\n\nBest wishes,\nAnna",
    templateSample:
      "Dear Jane,\n\nThank you for your recent message. I was very glad to hear from you again, and many happy returns of the day!\n\nAs for your questions, I get presents two or three times a year, mostly on holidays. I like both getting and giving them, but giving is better, because it is so nice to surprise people.\n\nThe best present I’ve ever got is a puppy. My parents gave him to me three years ago, and now he is my best friend. We walk together every day and play in the park.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nIvan",
  },

  speaking: {
    hardWords: [
      {
        word: "footwear",
        tip: "/ˈfʊtweə/ — «ФУТ-уэ», ударение на первый слог",
      },
      { word: "professional", tip: "/prəˈfeʃənl/ — «прэ-ФЭ-шнл»" },
      { word: "trainers", tip: "/ˈtreɪnəz/ — «ТРЭЙ-нэз»" },
      { word: "demand", tip: "/dɪˈmɑːnd/ — «ди-МАНД»" },
      { word: "significantly", tip: "/sɪɡˈnɪfɪkəntli/ — «сиг-НИ-фи-кэнт-ли»" },
      { word: "sandals", tip: "/ˈsændlz/ — «СЭН-длз»" },
      { word: "rubber", tip: "/ˈrʌbə/ — «РА-бэ»" },
      { word: "athletes", tip: "/ˈæθliːts/ — «ЭС-литс», th как в слове think" },
      { word: "stable", tip: "/ˈsteɪbl/ — «СТЭЙ-бл»" },
      { word: "silently", tip: "/ˈsaɪləntli/ — «САЙ-лэнт-ли»" },
      { word: "criminals", tip: "/ˈkrɪmɪnlz/ — «КРИ-ми-нлз»" },
      { word: "sneak", tip: "/sniːk/ — «СНИК», долгий звук [iː]" },
      { word: "secretly", tip: "/ˈsiːkrətli/ — «СИ-крэт-ли»" },
      { word: "1917", tip: "nineteen seventeen — год читают парами" },
      { word: "essential", tip: "/ɪˈsenʃl/ — «и-СЭН-шл»" },
    ],
    task2Samples: [
      "In my free time I like to read books, listen to music and meet my friends. At weekends I also go cycling in the park.",
      "On average I watch TV for about an hour a day. I prefer to watch it in the evening, when I have finished my homework.",
      "I like comedies and adventure films best. They are funny and exciting, and they help me relax after school.",
      "My favourite film is Harry Potter. I like it because it is full of magic and friendship, and I have watched it many times.",
      "I would make a programme about the history of our country. It could show old places, tell interesting stories and invite real historians to talk about them.",
      "I wouldn’t like to be a famous actor, because famous people have no private life. I prefer a quiet life and a job that I can do without cameras around.",
    ],
    task3Sample:
      "I’d like to tell you about my winter holidays.\nMy winter holidays usually last about two weeks, from the end of December to the beginning of January. It’s my favourite time of the year.\nMy family celebrates New Year at home. We decorate the tree, cook a lot of tasty dishes and watch the President’s speech. At midnight we make a wish and open the presents.\nI do make New Year’s resolutions. Last year I promised myself to read more books and to do sport every morning. I think it is good to have a goal, even if you don’t manage to do everything.\nAs for my attitude to winter holidays, I like them very much. I can rest, play in the snow and spend more time with my family.\nThat’s all I wanted to say about my winter holidays.",
  },
};
