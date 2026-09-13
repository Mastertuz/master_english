import { demo2027Rules } from "./demo-2027-rules";
import type { OgeVariant } from "./types";

/**
 * Демонстрационный вариант ОГЭ 2027 по английскому языку (ФИПИ):
 * письменная часть — 35 заданий, устная — 3 задания.
 * Метки времени в записях найдены по паузам в самих mp3.
 */
export const demo2027: OgeVariant = {
  id: "demo-2027",
  title: "Демоверсия ОГЭ 2027",
  subtitle:
    "Официальный демонстрационный вариант ФИПИ: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть",

  rules: demo2027Rules,

  /* ─────────────────────────── Раздел 1. Аудирование ─────────────────────────── */

  listening: {
    audioUrl: "/audio/oge/demo-2027/listening.mp3",
    marks: [
      { label: "Задания 1–4", at: 0 },
      { label: "Задание 5", at: 494 },
      { label: "Задания 6–11", at: 1033 },
    ],

    part1: {
      timecodes: [
        { label: "Инструкция", at: 0 },
        { label: "Text A", at: 100 },
        { label: "Text B", at: 137 },
        { label: "Text C", at: 175 },
        { label: "Text D", at: 224 },
        { label: "Text A · 2-й раз", at: 298 },
        { label: "Text B · 2-й раз", at: 335 },
        { label: "Text C · 2-й раз", at: 373 },
        { label: "Text D · 2-й раз", at: 423 },
      ],
      intro:
        "Вы услышите четыре коротких текста, обозначенных буквами A, B, C, D. В заданиях 1–4 выберите вариант ответа 1, 2 или 3. Вы услышите запись дважды.",
      questions: [
        {
          n: 1,
          prompt: "Text A. The hiking instructor advises the hikers on ...",
          options: [
            "how to cook food on a fire.",
            "what to wear on the hiking trip.",
            "how to find the way through the forest.",
          ],
          answer: "2",
          explanation: {
            proof:
              "Don’t go with bare legs… Wear comfortable jeans or sport trousers.",
            why: "Инструктор прямо советует, в чём идти: не с голыми ногами, а в джинсах или спортивных брюках.",
            trap: "Вариант 1: барбекю упоминается, но инструктор не учит готовить — он говорит, что еду там приготовят. Вариант 3: маршрут проходит через кусты и холмы, но как найти дорогу, не объясняется.",
          },
        },
        {
          n: 2,
          prompt: "Text B. What present does Mary suggest buying for their mother?",
          options: ["A pot plant.", "An umbrella.", "A cherry cake."],
          answer: "1",
          explanation: {
            proof:
              "I’ve found nothing except a large indoor plant in a ceramic pot… As for the green plant – she’s always liked things like that.",
            why: "Мэри предлагает купить растение в керамическом горшке и спрашивает Стива, согласен ли он.",
            trap: "Торт уже заказан — это не подарок, который предлагают купить. Зонт Мэри хотела купить сначала, но передумала из-за ужасного цветочного рисунка.",
          },
        },
        {
          n: 3,
          prompt:
            "Text C. Nancy doesn’t want to participate in the family business because ...",
          options: [
            "she is allergic to cats.",
            "she doesn’t like animals.",
            "she’s chosen another profession.",
          ],
          answer: "3",
          explanation: {
            proof:
              "I’ve always dreamed of a career in professional sports, which can’t be combined with running a clinic.",
            why: "Нэнси мечтает о профессиональном спорте, а его нельзя совмещать с ветклиникой.",
            trap: "Аллергия у сестры, а не у Нэнси. На вопрос, не любит ли она животных, Нэнси отвечает «Of course, I do!» — любит.",
          },
        },
        {
          n: 4,
          prompt: "Text D. What are Alice and Ron going to have for lunch?",
          options: ["Pancakes.", "Spaghetti.", "Sandwiches."],
          answer: "2",
          explanation: {
            proof:
              "I know that you’re happy to eat spaghetti three times a day. Ok. I’ll have it too.",
            why: "Рон выбирает спагетти, Элис решает есть то же самое, чтобы не готовить другое.",
            trap: "Блинчики звучат первыми, но для них нет ни яиц, ни молока. Сэндвичи предложены как вариант, но их не выбрали.",
          },
        },
      ],
      transcripts: [
        {
          title: "Text A",
          at: 100,
          text: "Hi, everyone! I’d like to give you some advice on our hiking holiday. Tomorrow, I’ll be waiting for you at the railway station at 8 am. It’s hot… but, anyway, don’t go with bare legs. Our route goes through bushes and rocky hills. Wear comfortable jeans or sport trousers – if you don’t want your legs to be scratched and mosquito-bitten. Do not forget water, but don’t take much food. We’ll be taking breaks at places equipped with barbeques where we can enjoy baked and grilled food.",
        },
        {
          title: "Text B",
          at: 137,
          text: "Hi, Steve! It’s Mary. I’ve already ordered a cherry cake for mum’s birthday so don’t worry about it. Now I’m in the shopping centre looking for a present for mum. From both of us. I’ve found nothing except a large indoor plant in a ceramic pot. At first, I wanted to buy her an umbrella, but they all had an awful flower print, which I think she won’t like. As for the green plant – she’s always liked things like that. If you agree, I’ll pay and order the delivery. Bye!",
        },
        {
          title: "Text C",
          at: 175,
          text: "Max: You are always busy at weekends, Nancy. What’s wrong?\nNancy: Nothing, Max. I just have to help my mum in her vet clinic. They are doing some renovations there.\nMax: Oh, yeah. A small family business always requires time and effort! Are you going to work as a vet too? Together with your mum?\nNancy: She’d be happy! My sister is allergic to cats, dogs and whatever. So, I’m mum’s only hope of taking over the clinic which she’s so proud of. But...\nMax: Don’t tell me you don’t like animals!\nNancy: Of course, I do! But I’ve always dreamed of a career in professional sports, which can’t be combined with running a clinic.\nMax: No, it can’t.",
        },
        {
          title: "Text D",
          at: 224,
          text: "Alice: It’s almost lunch time. Are you hungry, Ron?\nRon: No, Alice, not really. Though I wouldn’t mind some pancakes with strawberry jam.\nAlice: I wouldn’t mind pancakes either but sorry – we’ve got neither eggs nor milk to make them. What we can make is either spaghetti or sandwiches with ham and cheese.\nRon: You know what I’ll choose, don’t you?\nAlice: Oh, yeah! I know that you’re happy to eat spaghetti three times a day. Ok. I’ll have it too, so as not to cook anything else. Would you like your spaghetti with some sauce or with salad?\nRon: With tomato sauce, please.\nAlice: It would be nice of you to help me set the table.",
        },
      ],
      strategy: {
        checks:
          "Понимание запрашиваемой информации в коротких диалогах и сообщениях.",
        steps: [
          "За 30 секунд до записи прочитайте вопросы и подчеркните ключевое слово: what to wear, what present, because, for lunch.",
          "При первом прослушивании отметьте вариант карандашом, при втором — проверьте его.",
          "Ждите конца текста: верный ответ часто звучит после того, как отброшены другие варианты.",
        ],
        mistakes: [
          "Выбирать вариант, слово из которого просто прозвучало в тексте (cake, umbrella, allergic). В записи упоминаются все три варианта, но подходит только один.",
          "Путать, о ком идёт речь: аллергия у сестры Нэнси, а не у неё самой.",
        ],
      },
    },

    part5: {
      n: 5,
      timecodes: [
        { label: "Инструкция", at: 494 },
        { label: "Ведущий", at: 561 },
        { label: "Speaker A", at: 577 },
        { label: "Speaker B", at: 616 },
        { label: "Speaker C", at: 652 },
        { label: "Speaker D", at: 697 },
        { label: "Speaker E", at: 735 },
        { label: "A · 2-й раз", at: 813 },
        { label: "B · 2-й раз", at: 852 },
        { label: "C · 2-й раз", at: 888 },
        { label: "D · 2-й раз", at: 933 },
        { label: "E · 2-й раз", at: 971 },
      ],
      intro:
        "Вы готовите тематическую радиопередачу с высказываниями пяти разных людей A–E. Подберите к каждому высказыванию рубрику из списка 1–6. Каждую рубрику используйте только один раз, одна рубрика лишняя. Вы услышите запись дважды.",
      letters: ["A", "B", "C", "D", "E"],
      options: [
        "I avoid these kinds of films",
        "I choose wisely",
        "I dislike cinemas",
        "I find cinemas expensive",
        "I learn from these films",
        "I recommend this film",
      ],
      answer: "32614",
      explanations: {
        A: {
          proof:
            "I love watching films on a big screen, but the rest of the experience is pretty awful.",
          why: "Говорящему мешают соседи с попкорном, телефонами и пинками в спинку кресла — ему не нравится сам поход в кинотеатр. Рубрика 3.",
          trap: "Про деньги здесь ни слова, поэтому 4 не подходит.",
        },
        B: {
          proof:
            "I always read the official reviews on the Internet… Apart from that, I rely on my friends’ opinions.",
          why: "Человек подробно рассказывает, как выбирает фильм: отзывы критиков и советы друзей. Рубрика 2.",
        },
        C: {
          proof: "It is absolutely essential to watch it at least once.",
          why: "Речь об одном конкретном фильме, который говорящий настойчиво советует посмотреть. Рубрика 6.",
          trap: "Фильм поднимает настроение, но ничему не учит — рубрика 5 лишняя.",
        },
        D: {
          proof:
            "There are some genres I never watch. Like, I don’t watch horror films… You’ll never see me watching an action film, either.",
          why: "Говорящий избегает определённых жанров — ужасов и боевиков. Рубрика 1.",
        },
        E: {
          proof:
            "I can’t make myself pay for a ticket, and spend that much money on snacks.",
          why: "Главный довод — жалко денег на билет и еду. Рубрика 4.",
          trap: "E тоже не любит ходить в кино, но рубрика 3 уже занята говорящим A. Решает деталь: у E — деньги, у A — поведение зрителей.",
        },
      },
      extra: {
        option: 5,
        why: "Никто не говорит, что узнаёт из фильмов что-то новое.",
      },
      transcripts: [
        {
          title: "Speaker A",
          at: 577,
          text: "Don’t get me wrong, I love watching films on a big screen, but the rest of the experience is pretty awful. Just imagine. You’re in the cinema, ready to see the film and someone next to you has a bag of popcorn or a bag of sweets. So they open it up halfway through the film and, to make things worse, they start chewing loudly. That drives me mad. Or even worse, they talk on their cell phones through the entire movie and start kicking the back of my chair, accidentally or otherwise.",
        },
        {
          title: "Speaker B",
          at: 616,
          text: "There are different ways to choose a good film to watch. Personally, I always read the official reviews on the Internet. I believe the things that professional critics say about the plot, the acting and the shooting. If they say the film is worth seeing, I go and see it. Apart from that, I rely on my friends’ opinions, as our tastes in films are quite similar. They know what genres I like and which I don’t. In most cases these recommendations are more than enough for me.",
        },
        {
          title: "Speaker C",
          at: 652,
          text: "I am sure that it is one of the most celebrated films in the entire history of filmmaking. A great all-time classic! It has everything that makes it just fantastic: a talented director, a perfect cast, a great soundtrack, a touching story, you name it. The shooting and acting are superb! It’s not an epic, nor a horror, but a drama that will suit most viewers’ tastes. It is absolutely essential to watch it at least once. Personally, I watch it every time I feel sad or disappointed. It just lifts up my mood.",
        },
        {
          title: "Speaker D",
          at: 697,
          text: "I am a great cinema and film fan. However, there are some genres I never watch. Like, I don’t watch horror films. They seem to be all about the scare factor and in most cases, they don’t have a good story or plot. You’ll never see me watching an action film, either. They are almost always the same. The good guys try to save the world. No special characters, nothing that makes me interested in the story. And I am not interested in seeing fights and car races for hours and hours.",
        },
        {
          title: "Speaker E",
          at: 735,
          text: "I don’t like going to the cinema. I haven’t been there almost 10 years. I don’t do well sitting and doing one thing for an hour and a half – I don’t feel safe. Plus, I can’t make myself pay for a ticket, and spend that much money on snacks, only to sit in the dark and focus on one thing. When I’m in my room or in the kitchen, I can do other things while I’m watching a movie, like having a snack or making dinner. Then I can pause it any time I need, so it’s really convenient.",
        },
      ],
      strategy: {
        checks:
          "Понимание основного содержания: общая мысль каждого высказывания.",
        steps: [
          "Переведите для себя каждую рубрику и подумайте, какими словами её могут выразить: expensive — pay, money, ticket price.",
          "При первом прослушивании запишите 1–2 ключевых слова по каждому говорящему.",
          "Сначала расставьте уверенные ответы, спорные решите при втором прослушивании.",
          "Проверьте, что ни одна рубрика не использована дважды и одна осталась лишней.",
        ],
        mistakes: [
          "Реагировать на отдельное слово, а не на главную мысль: у говорящего C звучит «horror», но он советует фильм, а не избегает жанров.",
          "Отдавать двум говорящим одну рубрику — за это теряется балл сразу за двоих.",
        ],
      },
    },

    part6: {
      timecodes: [
        { label: "Инструкция", at: 1034 },
        { label: "Интервью", at: 1103 },
        { label: "Интервью · 2-й раз", at: 1268 },
        { label: "Конец записи", at: 1434 },
      ],
      transcriptAt: 1103,
      intro:
        "Вы помогаете другу, юному радиожурналисту, проанализировать интервью. Прослушайте запись и заполните таблицу: не более одного слова (без артиклей) из прозвучавшего текста. Числа записывайте буквами. Вы услышите запись дважды.",
      rows: [
        {
          n: 6,
          label: "Current job",
          answer: "librarian",
          explanation: {
            proof: "I work there. I’m a librarian.",
            why: "Сейчас собеседница работает библиотекарем.",
            trap: "Waitress, secretary, office manager — прежние работы, а спрашивают о нынешней.",
          },
        },
        {
          n: 7,
          label: "Number of jobs he/she has done",
          answer: "twelve",
          explanation: {
            proof: "This is my twelfth job, in fact. — You’ve already tried twelve different jobs?!",
            why: "Нужно количество, поэтому пишем количественное числительное буквами: twelve.",
            trap: "Twelfth — порядковое числительное («двенадцатая»), а цифра 12 не засчитывается: числа пишут буквами.",
          },
        },
        {
          n: 8,
          label: "The foreign language he/she speaks",
          answer: "Chinese",
          explanation: {
            proof: "The language I learned in college was Chinese.",
            why: "Собеседница учила и продолжает учить китайский.",
            trap: "Spanish и German звучат в вопросе интервьюера — их она не выбрала.",
          },
        },
        {
          n: 9,
          label: "Hobby",
          answer: "travelling;traveling",
          explanation: {
            proof: "I like travelling. It’s my real hobby.",
            why: "Хобби — путешествия. Засчитываются британское travelling и американское traveling.",
            trap: "Drawing и dancing предлагает интервьюер, ответ — «Hmm, no!».",
          },
        },
        {
          n: 10,
          label: "The musical instrument he/she plays",
          answer: "piano",
          explanation: {
            proof: "Do you mean the Chinese bamboo flute? No! But I play the piano.",
            why: "Собеседница играет на фортепиано.",
            trap: "Flute звучит раньше, но это инструмент, на котором она не играет.",
          },
        },
        {
          n: 11,
          label: "Regular sports activity",
          answer: "jogging",
          explanation: {
            proof:
              "I go jogging. I would like to go swimming but there’s no swimming pool nearby, so I jog almost every evening.",
            why: "Регулярно — пробежки почти каждый вечер.",
            trap: "Swimming — то, чем хотелось бы заниматься, но бассейна рядом нет.",
          },
        },
      ],
      transcript:
        "Interviewer: First of all, I would like to thank you for agreeing to take part in our survey. It’s really very important for us.\nRespondent: My pleasure.\nInterviewer: I see that you’ve just left the library. Do you often go there to borrow books?\nRespondent: In fact... I was in the library for a different reason. I work there. I’m a librarian.\nInterviewer: So, you are a librarian, aren’t you? OK. Have you ever worked in any other places?\nRespondent: Of course. I’ve worked as a waitress, a secretary, an office manager and whatever! This is my twelfth job, in fact.\nInterviewer: You’ve already tried twelve different jobs?! Fantastic!\nRespondent: Yes, I enjoy trying new things and learning new skills.\nInterviewer: Right. Can I ask you about the foreign languages you speak?\nRespondent: Of course. The language I learned in college was Chinese. And I’m still learning it, because you can never speak Chinese well enough.\nInterviewer: Oh, it’s so difficult! Why didn’t you choose Spanish or German?\nRespondent: I don’t know why. I just wanted to learn Chinese.\nInterviewer: What is your hobby? What do you do for pleasure? Do you like drawing or dancing?\nRespondent: Hmm, no! I like travelling. It’s my real hobby. And my favourite destination is China. I’ve been there several times and will go again. It’s an amazing country and you can see much more there if you speak their language.\nInterviewer: Right.\nRespondent: Chinese culture, art and music are very different from ours.\nInterviewer: Can you play any traditional musical instruments?\nRespondent: Do you mean the Chinese bamboo flute? No! But I play the piano. Well enough. I took piano classes when I was at school, and my teacher was very good. She taught me to feel and love music.\nInterviewer: And what about sports? What do you do to keep fit?\nRespondent: Hmm. I go jogging. I would like to go swimming but there’s no swimming pool nearby, so I jog almost every evening.\nInterviewer: Evening?\nRespondent: Yes. I prefer jogging in the evening, not in the morning like most people do. I hate getting up early and evenings are better for me.\nInterviewer: I see. And one more question...",
      strategy: {
        checks:
          "Понимание запрашиваемой информации и краткая запись её в таблицу.",
        steps: [
          "Прочитайте строки таблицы и предположите часть речи: job — существительное, number — числительное буквами.",
          "Пишите слово ровно так, как оно прозвучало, без артикля.",
          "Проверьте орфографию: ошибка в одной букве — ноль баллов.",
        ],
        mistakes: [
          "Записывать цифрами (12) или порядковым числительным (twelfth).",
          "Выбирать первое прозвучавшее слово: интервьюер нарочно предлагает неверные варианты (drawing, dancing, flute, swimming).",
          "Писать больше одного слова: «play the piano» вместо «piano».",
        ],
      },
    },
  },

  /* ───────────────────────────── Раздел 2. Чтение ───────────────────────────── */

  reading: {
    part12: {
      n: 12,
      intro:
        "Вы проводите информационный поиск в ходе выполнения проектной работы. Определите, в каком из текстов A–F содержатся ответы на вопросы 1–7. Один из вопросов останется без ответа.",
      letters: ["A", "B", "C", "D", "E", "F"],
      options: [
        "What goods were made from the plant, the symbol of Scotland?",
        "What is the national sporting event of the country?",
        "What endangered plants grow in the Scottish Highlands?",
        "What plant brings luck and success?",
        "What is the stereotype of Scotland like?",
        "Why is Scotland an attractive place for those who love sports?",
        "What is the modern profile of Scotland like?",
      ],
      answer: "574162",
      texts: [
        {
          letter: "A",
          text: "Thanks to television and films, Scotland is often seen by the rest of the world as a magical country, a land of misty mountains and the home of a lake creature called Nessie. This is the image most people have in mind. The truth, however, is completely different from the way the world thinks of Scotland. You may be surprised to find out that most Scots live in the lowlands and don’t believe in Nessie.",
        },
        {
          letter: "B",
          text: "Scotland is much more than green hills and picturesque valleys. It’s dynamic and cosmopolitan, with a colourful history of invention and innovation. It’s the home of big businesses and a centre of new medical and scientific development. Each year, it hosts the world’s biggest contemporary arts festivals.",
        },
        {
          letter: "C",
          text: "Scottish heather, a small bush with flowers, is the floral symbol of the country. The colour of the flowers usually varies from purple to lilac, but they can also be white. In the past, the Scots believed that they would never be captured by enemies and would win victories if they wore white heather. Today, when getting married, girls add white heather to bouquets to bring fortune to their family.",
        },
        {
          letter: "D",
          text: "Heather has grown in Scotland as far back as its history goes. It is an essential thing for any household. Famous heather honey is rich in minerals, and was traditionally used in medicinal drinks. Traditionally dried heather was used to make perfumes, and the tough stems were used to make ropes. On many of the northern Scottish islands, heather was used in the construction of houses.",
        },
        {
          letter: "E",
          text: "Scotland is an excellent destination for open-air activities all year round. Its lakes and coastline are ideal for boating and rowing and have some of the best sea-kayaking in the world. The rivers are perfect for fishing and the mountains are wonderful for hill climbing and skiing. Scotland is also good for walkers. You can enjoy easy family walks or more difficult mountain hikes.",
        },
        {
          letter: "F",
          text: "The history of Scotland is rich in armed conflicts. The Scots have always valued physical power and the skills needed for battle and survival. That’s why the Highland Games were very popular. They date back to long before Scotland’s written history. The Games are still held today and include the athletic competitions in their original form as well as dancing contests. Traditional bagpipe music accompanies all the events.",
        },
      ],
      explanations: {
        A: {
          proof: "Scotland is often seen by the rest of the world as a magical country… This is the image most people have in mind.",
          why: "Текст о том, какой Шотландию представляет мир, — это стереотип. Вопрос 5.",
        },
        B: {
          proof: "It’s dynamic and cosmopolitan… the home of big businesses and a centre of new medical and scientific development.",
          why: "Современная Шотландия: бизнес, наука, фестивали. Вопрос 7.",
          trap: "Первое предложение про зелёные холмы похоже на текст A, но дальше речь о современности.",
        },
        C: {
          proof: "…would win victories if they wore white heather… to bring fortune to their family.",
          why: "Белый вереск приносит победу и удачу. Вопрос 4.",
          trap: "Вереск — символ страны, поэтому тянет выбрать вопрос 1. Но в C нет ни слова о том, что из него делали.",
        },
        D: {
          proof: "…used to make perfumes, and the tough stems were used to make ropes.",
          why: "Из вереска делали мёд, лекарственные напитки, духи, верёвки, строили дома. Вопрос 1.",
        },
        E: {
          proof: "Scotland is an excellent destination for open-air activities all year round.",
          why: "Каякинг, рыбалка, лыжи, походы — почему Шотландия привлекает любителей спорта. Вопрос 6.",
          trap: "Вопрос 2 про национальное спортивное событие — его в E нет, только виды активного отдыха.",
        },
        F: {
          proof: "That’s why the Highland Games were very popular… The Games are still held today.",
          why: "Игры горцев — национальное спортивное событие. Вопрос 2.",
        },
      },
      extra: {
        option: 3,
        why: "Об исчезающих растениях высокогорья не говорится ни в одном тексте. Вереск растёт повсюду и под угрозой не находится.",
      },
      strategy: {
        checks: "Понимание основного содержания коротких текстов.",
        steps: [
          "Сначала прочитайте вопросы и выделите в каждом главное: goods made, sporting event, endangered, luck, stereotype, attractive for sports, modern profile.",
          "Читайте текст целиком и формулируйте его тему своими словами в 2–3 слова.",
          "Ищите синонимы, а не одинаковые слова: luck — fortune, stereotype — the image most people have in mind.",
          "Оставьте спорные пары напоследок: когда остальные расставлены, выбор сужается.",
        ],
        mistakes: [
          "Соединять текст с вопросом из-за общего слова: plant есть в вопросах 1, 3, 4, но вопрос 3 не подходит ни к одному тексту.",
          "Путать похожие темы: активный отдых (E) и национальное событие (F).",
        ],
      },
    },

    part13: {
      intro:
        "Прочитайте текст. Определите, какие из утверждений 13–19 соответствуют содержанию текста (1 – True), какие не соответствуют (2 – False) и о чём в тексте не сказано (3 – Not stated).",
      title: "Running the Thames",
      paragraphs: [
        "Three friends Alan, Tom and Martin decided to run 184 miles along the most famous British river – from the beginning of the Thames down to its mouth, where the river runs into the sea.",
        "Their preparations for the marathon didn’t take long and they set out. It was not easy to find the place marked on the map as the official source of the river Thames. In reality, it was an old stone under a big tree. Surprisingly, there was practically no water at the source, just a small pit. However, at the end of the first day they came to a narrow stream running under a wooden bridge.",
        "The runners were lucky with the weather; it was cool and bright for the whole week. Soft winds blew and the sun shone. In spite of the weather, the start of the marathon was not very promising. On the first day, Martin accidentally fell over a tree root and hurt his foot. In addition to that, Alan said he had damaged his rucksack during their preparation. However, the friends went on running.",
        "They passed lovely houses and some wonderful nature. The Thames had grown from a small river into a strong stream. Hypnotised by the view of the river, Tom missed the path and fell into the mud. Cold and angry, he was a real trouble the first day. In the evening, the runners reached the point where the river became possible to navigate. The friends were so tired that they stopped at a cheap hotel for food, drink and sleep.",
        "The second day they ran along arched stone bridges and through forty-five river locks, each one having its own history. The runners stopped at the first lock to take a photo by the 19th century statue of Old Father Thames. The other locks and the bridges, dating from the 13th century, could have told much about British royal families, writers and inventors, battles and victories. So the runners spent the second day exploring the locks and the old bridges and taking photos.",
        "The next few days Alan, Tom and Martin ran through quiet and peaceful places in Oxfordshire. The calm river occupied all their thoughts and they left their troubles behind them. They spent nights at small Bed-and-Breakfasts with unusual foreign guests who were discovering the old British towns, castles and churches.",
        "Closer to London the Thames changed its character. It became wide and busy with numerous boats and ships. The banks were full of grand houses with green lawns, street markets and modern walkways.",
        "On the seventh day the runners followed the river as it cut the capital in two. The friends made their way past famous London sights such as The Tower, The London Eye and Greenwich.",
        "Finally the friends got to The Thames Barrier, where the river ran into the sea. The marathon was over.",
      ],
      statements: [
        {
          n: 13,
          prompt: "There was a natural mark which indicated the start of the river Thames.",
          options: ["True", "False", "Not stated"],
          answer: "1",
          explanation: {
            proof: "…the official source of the river Thames. In reality, it was an old stone under a big tree.",
            why: "Начало реки обозначено камнем под деревом — это природный знак.",
            trap: "Слово «surprisingly» и «no water» сбивают на False, но утверждение говорит о метке, а не о воде.",
          },
        },
        {
          n: 14,
          prompt: "During the marathon the weather was fine.",
          options: ["True", "False", "Not stated"],
          answer: "1",
          explanation: {
            proof: "The runners were lucky with the weather; it was cool and bright for the whole week.",
            why: "Всю неделю было прохладно и солнечно — погода была хорошей.",
            trap: "«The start of the marathon was not very promising» — это про травмы, а не про погоду.",
          },
        },
        {
          n: 15,
          prompt: "After the accident with Martin’s leg, Tom carried his rucksack.",
          options: ["True", "False", "Not stated"],
          answer: "3",
          explanation: {
            proof: "Martin… hurt his foot. In addition to that, Alan said he had damaged his rucksack.",
            why: "Про травму Мартина и рюкзак Алана сказано, а кто нёс чей рюкзак — нет. Значит, Not stated.",
            trap: "Все слова утверждения есть в тексте, поэтому хочется ответить True или False. Но связи между ними текст не устанавливает.",
          },
        },
        {
          n: 16,
          prompt: "During the marathon the friends spent all their nights in the tent.",
          options: ["True", "False", "Not stated"],
          answer: "2",
          explanation: {
            proof: "…they stopped at a cheap hotel… They spent nights at small Bed-and-Breakfasts.",
            why: "Друзья ночевали в гостинице и мини-отелях, значит, не все ночи в палатке — False.",
          },
        },
        {
          n: 17,
          prompt: "There were a lot of tourists near the statue of Old Father Thames.",
          options: ["True", "False", "Not stated"],
          answer: "3",
          explanation: {
            proof: "The runners stopped at the first lock to take a photo by the 19th century statue of Old Father Thames.",
            why: "О туристах у статуи ничего не сказано.",
            trap: "Иностранные гости упоминаются, но в мини-отелях Оксфордшира, а не у статуи.",
          },
        },
        {
          n: 18,
          prompt: "Near London the Thames was closed to navigation.",
          options: ["True", "False", "Not stated"],
          answer: "2",
          explanation: {
            proof: "Closer to London… It became wide and busy with numerous boats and ships.",
            why: "Раз по реке идут многочисленные лодки и корабли, судоходство открыто — False.",
          },
        },
        {
          n: 19,
          prompt: "The marathon route went through London.",
          options: ["True", "False", "Not stated"],
          answer: "1",
          explanation: {
            proof: "On the seventh day the runners followed the river as it cut the capital in two… past famous London sights.",
            why: "Бегуны пробежали через Лондон мимо Тауэра и Лондонского глаза — True.",
          },
        },
      ],
      strategy: {
        checks: "Понимание запрашиваемой информации в тексте.",
        steps: [
          "Утверждения идут в порядке текста — ищите ответ на 14 после места, где нашли 13.",
          "Найдите абзац по ключевым словам и перечитайте его медленно.",
          "True — текст говорит то же другими словами. False — текст говорит обратное. Not stated — в тексте нет информации, чтобы проверить утверждение.",
        ],
        mistakes: [
          "Отвечать по здравому смыслу, а не по тексту: у статуи наверняка бывают туристы, но в тексте об этом нет — Not stated.",
          "Путать False и Not stated. Для False в тексте должно быть противоречие (hotel вместо tent), для Not stated — пустота.",
        ],
      },
    },
  },

  /* ─────────────────────── Раздел 3. Грамматика и лексика ─────────────────────── */

  grammar: {
    part20: {
      intro:
        "Прочитайте текст. Преобразуйте слова, напечатанные заглавными буквами, так, чтобы они грамматически соответствовали содержанию текста. Заполните пропуски 20–28.",
      lines: [
        {
          n: 20,
          before: "It was a great day yesterday. My friends and I",
          after: "to see a performance at the Bolshoi Theatre.",
          word: "GO",
          answer: "went",
          explanation: {
            why: "Past Simple: действие случилось вчера (yesterday). Go — неправильный глагол: go – went – gone.",
          },
        },
        {
          n: 21,
          before: "You certainly know that the Bolshoi Theatre is the",
          after: "theatre in Russia and probably in the world.",
          word: "FAMOUS",
          answer: "most famous",
          explanation: {
            why: "Превосходная степень: самый известный в России и в мире. Famous — длинное прилагательное, поэтому most famous. Артикль the уже стоит перед пропуском.",
            trap: "«Famousest» не существует, а «the most famous» даёт лишний артикль — the уже есть в тексте.",
          },
        },
        {
          n: 22,
          before: "But not everyone",
          after: "the history of the Bolshoi Theatre.",
          word: "KNOW",
          answer: "knows",
          explanation: {
            why: "Present Simple: общеизвестный факт в настоящем. Everyone согласуется как he/she, поэтому окончание -s.",
            trap: "Everyone означает «все», но глагол после него стоит в единственном числе.",
          },
        },
        {
          n: 23,
          before: "According to historical documents, it",
          after: "in March 1776 when Prince Pyotr Urusov was granted Royal permission to build a public theatre in Moscow.",
          word: "BEGIN",
          answer: "began",
          explanation: {
            why: "Past Simple: событие в прошлом с точной датой — March 1776. Begin — неправильный: begin – began – begun.",
          },
        },
        {
          n: 24,
          before: "Catherine II, Empress of Russia, was fond of arts. She",
          after: "having a new theatre in her country.",
          word: "NOT MIND",
          answer: "did not mind;didn't mind",
          explanation: {
            why: "Отрицание в Past Simple: did not (didn’t) + глагол в начальной форме. Рассказ о прошлом — was fond of arts.",
            trap: "«Not minded» и «didn’t minded» неверны: после did глагол без -ed.",
          },
        },
        { text: "The original building of the theatre had a hall with almost 1,000 seats, a stage and an orchestra pit." },
        {
          n: 25,
          before: "Directly over the stage there",
          after: "boxes where the most noble fans of the theatre had their seats.",
          word: "BE",
          answer: "were",
          explanation: {
            why: "Оборот there was/were: после пропуска стоит множественное число (boxes), рассказ в прошлом (had their seats).",
            trap: "«Was» не подходит к boxes, «are» — к прошедшему времени.",
          },
        },
        {
          n: 26,
          before: "The theatre has changed several times during",
          after: "history.",
          word: "IT",
          answer: "its",
          explanation: {
            why: "Перед существительным history нужно притяжательное местоимение: its — «его (театра) история».",
            trap: "It’s = it is. Апостроф в its на экзамене — орфографическая ошибка, ноль баллов.",
          },
        },
        {
          n: 27,
          before: "The building we can see today opened in 1825. It",
          after: "by architect Andrei Mikhailov who was also the architect of the Maly Theatre.",
          word: "DESIGN",
          answer: "was designed",
          explanation: {
            why: "Пассив в Past Simple: здание не проектировало само, его спроектировали — это видно по by architect. Форма: was + V3.",
            trap: "«Designed» без was означало бы, что здание само что-то спроектировало.",
          },
        },
        { text: "Since that time, the building has been rebuilt and renovated several times. Now it looks beautiful from the inside and outside." },
        {
          n: 28,
          before: "If I",
          after: "the opportunity to go there more often, I would do it every week.",
          word: "HAVE",
          answer: "had",
          explanation: {
            why: "Условное предложение второго типа: нереальное условие в настоящем. If + Past Simple, … would + глагол.",
            trap: "«Would have» в части с if не ставится, а «have» не сочетается с would во второй части.",
          },
        },
      ],
      strategy: {
        checks:
          "Грамматические формы: времена, пассив, степени сравнения, местоимения, условные предложения.",
        steps: [
          "Прочитайте всё предложение, а не только слова рядом с пропуском.",
          "Найдите подсказки времени: yesterday, in 1776, today, since that time.",
          "Определите, кто совершает действие. Если действие совершают над подлежащим (by architect), нужен пассив.",
          "Проверьте согласование с подлежащим: everyone knows, there were boxes.",
          "Перечитайте предложение с вашим словом целиком.",
        ],
        mistakes: [
          "Орфография неправильных глаголов: begined, goed.",
          "Лишний артикль в превосходной степени: the уже стоит в тексте.",
          "It’s вместо its.",
          "Не заметить пассив: designed вместо was designed.",
        ],
      },
    },

    part29: {
      intro:
        "Прочитайте текст. Образуйте от слов, напечатанных заглавными буквами, однокоренные слова так, чтобы они грамматически и лексически соответствовали содержанию текста. Заполните пропуски 29–34.",
      lines: [
        {
          n: 29,
          before: "There are lots of products that help us fight bad moods and depression. If you feel down and",
          after: ", just get a bar of dark chocolate from the fridge.",
          word: "SLEEP",
          answer: "sleepy",
          explanation: {
            why: "После feel … and нужно прилагательное, как down. Суффикс -y: sleep → sleepy «сонный».",
            trap: "Asleep значит «спящий», так нельзя «чувствовать себя».",
          },
        },
        {
          n: 30,
          before: "Chocolate will improve your mood and you’ll feel",
          after: "and happy again.",
          word: "CHEER",
          answer: "cheerful",
          explanation: {
            why: "Прилагательное в паре с happy. Суффикс -ful «полный чего-то»: cheerful «бодрый, весёлый».",
          },
        },
        {
          n: 31,
          before: "This",
          after: "is often used in chocolate adverts.",
          word: "INFORM",
          answer: "information",
          explanation: {
            why: "После this нужно существительное. Inform → information, суффикс -ation.",
            trap: "Information неисчисляемое: informations не бывает, а this informations не согласуется с is.",
          },
        },
        {
          n: 32,
          before: "Unfortunately, we can’t use this method too often. The positive effect does not last long. Meanwhile chocolate is not",
          after: "food.",
          word: "HARM",
          answer: "harmless",
          explanation: {
            why: "Дальше сказано, что в шоколаде жир и сахар и он может вызвать аллергию, — он не безвредный. Суффикс -less «без»: harmless.",
            trap: "Harmful даёт обратный смысл: «not harmful food» — «не вредная еда», а текст говорит о вреде.",
          },
        },
        {
          n: 33,
          before: "It contains fat and sugar which can make you overweight. Some people may also be allergic to chocolate and it can affect their",
          after: ", causing skin problems.",
          word: "APPEAR",
          answer: "appearance",
          explanation: {
            why: "После their — существительное. Appear → appearance «внешность»: проблемы с кожей портят внешний вид.",
          },
        },
        {
          n: 34,
          before: "The alternative and",
          after: "safe method to fight depression is doing sport. It can be recommended to everyone!",
          word: "ABSOLUTE",
          answer: "absolutely",
          explanation: {
            why: "Слово описывает прилагательное safe, значит, нужно наречие: absolute → absolutely.",
          },
        },
      ],
      strategy: {
        checks: "Словообразование: суффиксы и приставки нужной части речи.",
        steps: [
          "Определите часть речи по соседним словам: после this/their — существительное, перед существительным и после feel — прилагательное, перед прилагательным — наречие.",
          "Проверьте смысл: нужно ли отрицание (harmless, unhappy, impossible).",
          "Проверьте число существительного и орфографию суффикса.",
        ],
        mistakes: [
          "Правильная часть речи, но неверный смысл: harmful вместо harmless.",
          "Орфография: cheerfull, apperance, absolutly.",
          "Множественное число у неисчисляемых: informations.",
        ],
      },
    },
  },

  /* ───────────────────────────── Раздел 4. Письмо ───────────────────────────── */

  writing: {
    n: 35,
    intro:
      "Напишите ответное электронное письмо зарубежному другу по переписке. Объём — 100–120 слов.",
    email: {
      from: "Mary@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "Russian towns",
      body: [
        "…My teacher told me that Russia has many beautiful small towns. I’d love to travel and see some of them.",
        "…What small Russian towns would you recommend visiting and why? What is the best way to travel around Russia? Where would you prefer to live, in a big city or in a town, and why?…",
      ],
    },
    task: [
      "Write a message to Mary and answer her 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: [
      {
        code: "К1",
        title: "Решение коммуникативной задачи",
        max: 3,
        full: "Полные и точные ответы на все 3 вопроса; обращение, завершающая фраза и подпись; благодарность за письмо и надежда на дальнейшие контакты.",
      },
      {
        code: "К2",
        title: "Организация текста",
        max: 2,
        full: "Логично, верно разделено на абзацы, есть связки; обращение, завершающая фраза и подпись — каждая на отдельной строке.",
      },
      {
        code: "К3",
        title: "Лексико-грамматическое оформление",
        max: 3,
        full: "Словарь и грамматика соответствуют уровню, не больше одной ошибки.",
      },
      {
        code: "К4",
        title: "Орфография и пунктуация",
        max: 2,
        full: "Не больше 1–2 ошибок.",
      },
    ],
    rules: [
      "Меньше 90 слов — 0 баллов за всё задание.",
      "Больше 132 слов — проверяют только первые 120.",
      "0 баллов по К1 — 0 за всё задание.",
      "Считаются все слова, включая обращение и подпись. I’ve, doesn’t — одно слово; 2010 — одно слово; pop-singer — одно слово; UK, e-mail, TV — одно слово.",
    ],
    plan: [
      "Обращение: Dear Mary, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — какие города и почему",
      "Абзац с ответом на вопрос 2 — как лучше путешествовать",
      "Абзац с ответом на вопрос 3 — где хотелось бы жить и почему",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя: Anna",
    ],
    sample:
      "Dear Mary,\n\nThanks for your email! I was really glad to hear from you.\n\nYou asked me about small Russian towns. I would recommend visiting Suzdal and Myshkin. Suzdal is full of old churches and wooden houses, and Myshkin has an amazing Mouse Museum.\n\nAs for travelling, I think the best way to see Russia is by train, because it is comfortable and you can enjoy the views from the window.\n\nPersonally, I would prefer to live in a small town. Life there is calm, the air is fresh and people are friendly, although a big city offers more opportunities.\n\nSorry, I have to go now. Write back soon!\n\nBest wishes,\nAnna",
    strategy: {
      checks: "Умение написать личное электронное письмо в ответ на письмо-стимул.",
      steps: [
        "Подчеркните в письме Мэри все три вопроса — на каждый нужен полный ответ, лучше с причиной (because…).",
        "Составьте план по абзацам: благодарность → ответы → надежда на контакт.",
        "Пишите простыми, но разнообразными конструкциями: I would recommend…, As for…, Personally, I would prefer…",
        "Посчитайте слова: цель — 100–120.",
        "Перечитайте на ошибки: артикли, окончания -s, времена, запятые после обращения и завершающей фразы.",
      ],
      mistakes: [
        "Ответить только на часть вопроса: «Suzdal» без «why».",
        "Писать подпись с фамилией или «Your friend, Anna» одной строкой.",
        "Задавать Мэри встречные вопросы — в ОГЭ этого не требуется, они только съедают слова.",
        "Не уложиться в объём: меньше 90 слов обнуляет письмо.",
      ],
    },
  },

  /* ─────────────────────────────── Устная часть ─────────────────────────────── */

  speaking: {
    audioUrl: "/audio/oge/demo-2027/speaking.mp3",

    task1: {
      instruction:
        "Task 1. You are going to read the text aloud. You have 1.5 minutes to read the text silently, and then be ready to read it aloud. Remember that you will not have more than 2 minutes for reading aloud.",
      text: "Bicycles or bikes are an important means of transportation in many parts of the world. The first bicycles turned up in Europe in the first half of the 19th century but the word “bicycle” only appeared later, in 1868. There are more bicycles in the world than cars. A lot of people have realized that cycling is an easy way to get around and a great way to cut down on pollution. More and more cities have special places where people can borrow a bike and ride around the city. Over the past few years, a bicycle infrastructure has been created in Moscow. Cycling in the centre of Moscow in summer is one of the most pleasant and quickest ways of seeing the city.",
      prepSec: 90,
      answerSec: 120,
      hardWords: [
        { word: "bicycle", tip: "/ˈbaɪsɪkl/ — «БАЙ-сикл», ударение на первый слог" },
        { word: "means", tip: "/miːnz/ — долгое «и»; means of transportation — средство передвижения" },
        { word: "Europe", tip: "/ˈjʊərəp/ — «ЮЭ-рэп», не «Европа»" },
        { word: "19th century", tip: "the nineteenth century /naɪnˈtiːnθ ˈsentʃəri/" },
        { word: "1868", tip: "eighteen sixty-eight — годы читают парами" },
        { word: "realized", tip: "/ˈrɪəlaɪzd/ — окончание -ed звучит как [d]" },
        { word: "pollution", tip: "/pəˈluːʃn/ — ударение на второй слог" },
        { word: "borrow", tip: "/ˈbɒrəʊ/ — ударение на первый слог" },
        { word: "infrastructure", tip: "/ˈɪnfrəstrʌktʃə/ — ударение на первый слог" },
        { word: "Moscow", tip: "/ˈmɒskəʊ/ — «МОС-коу»" },
        { word: "pleasant", tip: "/ˈpleznt/ — «ПЛЕЗ-нт», не «плизант»" },
      ],
      criteria:
        "Максимум 2 балла. 2 — речь понятна, нет лишних пауз, не больше 5 фонетических ошибок (из них 1–2 искажают смысл). 1 — есть необоснованные паузы, не больше 7 ошибок. 0 — речь понимается с трудом или больше 7 ошибок.",
      strategy: {
        checks: "Чтение вслух текста научно-популярного характера.",
        steps: [
          "За 1,5 минуты прочитайте текст про себя, отметьте трудные слова, числа и даты.",
          "Разбейте длинные предложения на смысловые группы и отметьте паузы.",
          "Читайте в спокойном темпе: 2 минут хватает с запасом, торопливость добавляет ошибок.",
          "Повышайте интонацию перед запятой в перечислении, понижайте в конце утвердительного предложения.",
        ],
        mistakes: [
          "Читать даты и числа по цифрам: «one eight six eight» вместо «eighteen sixty-eight».",
          "Ставить русское ударение в международных словах: Европа, инфраструктура.",
          "Останавливаться и перечитывать слово заново — это считается необоснованной паузой.",
        ],
      },
    },

    task2: {
      instruction:
        "Task 2. You are going to take part in a telephone survey. You have to answer six questions. Give full answers to the questions. Remember that you have 40 seconds to answer each question.",
      answerSec: 40,
      introText:
        "Electronic assistant: Hello! It’s the electronic assistant of The TeenWeb. We kindly ask you to take part in our survey. We would like to find out how teenagers feel about their homework. Please answer six questions. The survey is anonymous – you don’t have to give your name. So, let’s get started.",
      outroText:
        "Electronic assistant: This is the end of the survey. Thank you very much for your cooperation.",
      questions: [
        {
          text: "How many lessons do you usually have?",
          start: 0,
          end: 39,
          sample:
            "I usually have six or seven lessons a day. On Saturdays we have only four lessons, so it is my favourite school day.",
        },
        {
          text: "What do you usually do after lessons?",
          start: 79.3,
          end: 88,
          sample:
            "After lessons I usually have lunch at home and take a short rest. Then I go to my swimming club or meet my friends in the park.",
        },
        {
          text: "How much time do you need to do your homework?",
          start: 128.4,
          end: 137.5,
          sample:
            "It depends on the day, but usually I need about two hours to do my homework. Maths and physics take the most time.",
        },
        {
          text: "Who helps you to do your homework?",
          start: 178,
          end: 186.9,
          sample:
            "Most of the time I do my homework on my own. When a task is really difficult, my elder brother or my mum helps me.",
        },
        {
          text: "Do you use the Internet when you do your homework? What for?",
          start: 227.4,
          end: 237.9,
          sample:
            "Yes, I often use the Internet when I do my homework. I look up new words in online dictionaries and find information for my projects.",
        },
        {
          text: "What would you recommend to a student who wants to spend less time on his/her homework?",
          start: 278.4,
          end: 290.8,
          sample:
            "I would recommend planning your time and starting your homework right after lessons. Also, it is a good idea to turn off your phone, because it distracts you.",
        },
      ],
      outro: { start: 331, end: 342 },
      criteria:
        "Максимум 6 баллов — по 1 за каждый ответ. 1 — дан полный ответ, отдельные ошибки не мешают пониманию. 0 — нет ответа, ответ не по вопросу, ответ одним словом или словосочетанием, либо ошибки мешают понять.",
      strategy: {
        checks: "Условный диалог-расспрос: полные ответы на вопросы телефонного опроса.",
        steps: [
          "Отвечайте 2–3 предложениями: прямой ответ + подробность или причина.",
          "Используйте время вопроса: How many lessons… → I usually have… lessons.",
          "Если не расслышали — ответьте по теме опроса, молчание даёт 0.",
          "Уложитесь в 40 секунд: начинайте говорить сразу после сигнала.",
        ],
        mistakes: [
          "Короткие ответы «Six.», «My mum.» — 0 баллов, даже если верно по смыслу.",
          "Отвечать не на тот вопрос: What for? требует объяснить, для чего нужен интернет.",
          "Менять время: вопрос в Present Simple, ответ в прошедшем.",
        ],
      },
    },

    task3: {
      instruction:
        "Task 3. You are going to give a talk about your school. You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "what your typical school day is like;",
        "what your favourite subject is, and why;",
        "what you like most about your school;",
        "what your attitude to your school life is.",
      ],
      prepSec: 90,
      answerSec: 120,
      criteria: [
        {
          code: "К1",
          title: "Решение коммуникативной задачи",
          max: 3,
          full: "Все 4 пункта раскрыты полно и развёрнуто, 10–12 фраз.",
        },
        {
          code: "К2",
          title: "Организация высказывания",
          max: 2,
          full: "Есть вступление и заключение, мысли логично связаны переходами.",
        },
        {
          code: "К3",
          title: "Языковое оформление",
          max: 2,
          full: "Не больше 4 негрубых лексико-грамматических и 3 фонетических ошибок.",
        },
      ],
      sample:
        "I’d like to tell you about my school.\nMy typical school day starts at half past eight and usually lasts until two o’clock. We have six or seven lessons with short breaks between them, and at the long break we have lunch in the school canteen.\nMy favourite subject is biology, because I’m interested in nature and our teacher explains everything in a very clear way. Besides, we often do experiments, which is really exciting.\nWhat I like most about my school is the friendly atmosphere. The teachers are always ready to help, and there are lots of clubs and school events.\nAs for my attitude to school life, I think it is busy but interesting. School gives me knowledge and good friends.\nThat’s all I wanted to say about my school.",
      strategy: {
        checks: "Связное монологическое высказывание по плану.",
        steps: [
          "За 1,5 минуты набросайте по 2–3 ключевых слова на каждый пункт плана — не пишите предложения целиком.",
          "Начните со вступления: I’d like to tell you about…",
          "Раскрывайте пункты по порядку, по 2–3 предложения на каждый.",
          "Связывайте части переходами: First of all, As for…, What I like most is…, Besides…",
          "Закончите заключением: That’s all I wanted to say about…",
        ],
        mistakes: [
          "Пропустить пункт плана или ответить на него одной фразой — теряются баллы по К1.",
          "Нет вступления или заключения — теряются баллы по К2.",
          "Меньше 6 фраз — 0 по К1, а значит, 0 за всё задание.",
        ],
      },
    },
  },
};
