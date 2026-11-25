import marks from "./audio/variant-6.marks.json";
import script from "./audio/variant-6.script.json";
import {
  choice,
  COMMON,
  dialogueText,
  gap,
  matching,
  NO_STRATEGY,
  statement,
  timedTranscripts,
  wordRow,
  type AudioMarks,
  type AudioScript,
} from "./book";
import { withExplanations } from "./explain";
import { variant6Explained } from "./variant-6-explained";
import type { OgeVariant } from "./types";
import { WRITING_SAMPLES } from "./writing-samples";

const audio = marks as AudioMarks;
const text = script as AudioScript;

/**
 * Вариант 6 из сборника «ОГЭ. Типовые экзаменационные варианты».
 * Задания, ключи и тексты записей — из книги; запись озвучена нейросетью, разбор — variant-6-explained.ts.
 */
const variant6Base: OgeVariant = {
  id: "variant-6",
  title: "Вариант 6",
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. Запись озвучена нейросетевым голосом, пояснений к ответам нет",
  origin: { synthAudio: true, explained: false },
  rules: {},

  listening: {
    audioUrl: "/audio/oge/variant-6/listening.mp3",
    marks: audio.listening.marks,

    part1: {
      timecodes: audio.listening.part1.timecodes,
      intro: COMMON.listening.part1Intro,
      questions: [
        choice(
          1,
          "Text A. The people who take part in the picnic should bring some...",
          ["food and drinks.", "anti-mosquito lotion.", "board games."],
          "2",
        ),
        choice(
          2,
          "Text B. The girl asks her mother...",
          [
            "to buy her a new computer.",
            "to help her tidy up the room.",
            "to give something to her friend.",
          ],
          "3",
        ),
        choice(
          3,
          "Text C. What means of transport is Amy going to use to get to the destination?",
          ["Plane.", "Train.", "Car."],
          "1",
        ),
        choice(
          4,
          "Text D. Emma has come to Italy...",
          ["to learn the language.", "to visit some friends.", "to get a job."],
          "3",
        ),
      ],
      transcripts: timedTranscripts(text.part1, audio.listening.part1.starts),
      strategy: NO_STRATEGY,
    },

    part5: {
      ...matching({
        n: 5,
        intro: COMMON.listening.part5Intro,
        letters: ["A", "B", "C", "D", "E"],
        options: [
          "Smart house",
          "Favourite piece of furniture",
          "Urban legend",
          "Vacation house",
          "City or countryside",
          "Interior design",
        ],
        answer: "31562",
        extraWhy: "Ни один из говорящих не рассказывает о доме для отпуска.",
      }),
      timecodes: audio.listening.part5.timecodes,
      transcripts: [
        {
          title: "Ведущий",
          at: audio.listening.part5.presenterAt,
          text: `Presenter: ${text.part5.presenter}`,
        },
        ...timedTranscripts(text.part5.speakers, audio.listening.part5.starts),
      ],
      strategy: NO_STRATEGY,
    },

    part6: {
      timecodes: audio.listening.part6.timecodes,
      transcriptAt: audio.listening.part6.transcriptAt,
      intro: COMMON.listening.part6Intro,
      rows: [
        wordRow(6, "Age of the respondent (… years old)", "fifteen"),
        wordRow(7, "The most difficult school subject", "Chemistry"),
        wordRow(
          8,
          "The job he/she would like to do in the future",
          "surgeon;doctor",
        ),
        wordRow(9, "Hobby", "painting"),
        wordRow(10, "Regular sports activity", "jogging"),
        wordRow(11, "Country of birth", "Canada"),
      ],
      transcript: dialogueText(text.part6),
      strategy: NO_STRATEGY,
    },
  },

  reading: {
    part12: {
      ...matching({
        n: 12,
        intro: COMMON.reading.part12Intro,
        letters: ["A", "B", "C", "D", "E", "F"],
        options: [
          "What does the name of the region mean?",
          "What is the symbol of the Arctic?",
          "Where is the Arctic located?",
          "What is the climate like in the Arctic?",
          "What natural resources is the Arctic rich in?",
          "Does the fauna of the Arctic need protection?",
          "How does global warming affect the Arctic?",
        ],
        answer: "471536",
        extraWhy:
          "Ни в одном тексте не сказано, что является символом Арктики.",
      }),
      texts: [
        {
          letter: "A",
          text: "The Arctic is not just a cold territory — it looks nothing like any other place on the Earth. There are no days and nights in the usual sense — the polar day and polar night last six months each. The Arctic life is characterized by short summers and long, cold winters, with temperatures well below freezing. In the summer, due to the long days of sunshine, the upper layer of the land thaws a bit, which makes it possible for some plants to grow.",
        },
        {
          letter: "B",
          text: "The huge territory of the Arctic region is almost entirely covered by water, much of which is frozen. Lately, due to climate change, the ice covering has been reducing dramatically. The ice zones are getting smaller and the ice layers are getting thinner. Scientists say that the temperatures in the Arctic continue to rise, which, in their opinion, may trigger all sorts of extreme weather far beyond the Arctic.",
        },
        {
          letter: "C",
          text: "The Arctic is a remote, cold and harsh territory, but for some reason, it has always attracted people. There are lots of books and films about that mysterious place. However, we don’t know much about the Arctic and even its name is misleading. It would be logical to suppose that the Arctic comes from the Greek word Arktos, which means bear, but it’s not like that! Most researchers believe that the name refers to two groups of stars — Little Bear and Great Bear.",
        },
        {
          letter: "D",
          text: "Despite the harsh and cold climate, about four million people call the Arctic their home. Native people tend to live in small settlements and towns. In the 1900s, many people from different countries moved to the Arctic and settled there due to the development of mining, oil drilling and other industries. Since then, lots of oil, gas and minerals, such as copper, nickel and zinc have been extracted.",
        },
        {
          letter: "E",
          text: "People who are not keen on geography may confuse the Arctic and Antarctica, which is not surprising — both territories are very cold and are covered with ice. But they are very different indeed! Antarctica is in the Southern hemisphere and it’s a continent, which means the ice lies on the land. While the Arctic is at the cap of the Northern hemisphere and there’s no land under the thick ice — the Arctic is the frozen ocean with some patches of land surrounding it.",
        },
        {
          letter: "F",
          text: "In fact, the Arctic is extremely poor in vegetation but it’s not a desert at all! The ice and water territories of the Arctic are inhabited by many animals. There are bowhead whales, beluga whales, walruses, polar bears and others. They are perfectly adapted to the harsh living conditions but are helpless to fight against people’s expanding activities and global warming. Recently, the Russian Arctic National Park was created, which gives the animals a better chance to survive.",
        },
      ],
      strategy: NO_STRATEGY,
    },

    part13: {
      intro: COMMON.reading.part13Intro,
      title: "The Rescue of Dresden Art Gallery",
      paragraphs: [
        "Dresden, a city in Germany, has a long history as the capital and royal residence for German kings. The city was famous for its magnificent royal palaces and beautiful buildings. Besides its architectural wonders, the city had a priceless collection of ancient paintings. They were kept in the Old Masters Picture Gallery from the 18th century till World War II. That is why the city was sometimes called The Jewel Box.",
        "Unfortunately, the city’s landmarks were totally destroyed during World War II. Only in 2005 the city was finally restored. German and Russian archaeologists, sculptors and artists worked hard to return the city to its historical look. Dresden Art Gallery was one of the most challenging tasks.",
        "When the Soviet Army entered Dresden in 1945, they found the gallery totally ruined, and most of its exhibits were burnt or gone. The gallery staff said that the masterpieces of Raphael, Rembrandt and Titian had been evacuated by railway. However, no one knew where exactly they were. General Konev, the Soviet Army’s commander, ordered to find the art collection as soon as possible.",
        "The search group of Russian soldiers questioned local people but found little information. The help came from one of the gallery keepers. The woman was sure that the collection wasn’t evacuated, it was hidden somewhere in the building of the Dresden Academy of Fine Arts. She was partly right. Amid the ruins of the building, the group found a room in the basement filled with sculptures and pieces of antique furniture. Unfortunately, the famous paintings were not discovered.",
        "There, the searchers found the necessary clue. A soldier noticed that one of the walls looked new. The wall was destroyed, and behind it, there was an old wardrobe. Inside, they found a map labelled “Top secret”. The map was hard to read because of strange letters and symbols but soon the searchers solved the riddle. The letters stood for the locations in the nearby area. One of them indicated an old tunnel abandoned long before.",
        "When the search group reached the tunnel, they found that the entrance was blocked. After removing the mines, the soldiers found the priceless paintings in the underground room. The original of The Sistine Madonna by Raphael was among them. As the cold, damp air could easily destroy the delicate paint, the search group decided to lift up the findings from the underground immediately.",
        "The soldiers guarded the paintings until Moscow restoration artists arrived. They examined the paintings and decided to carry them to Moscow for professional treatment. The restoration of the saved masterpieces took ten years. In 1955 the whole collection was returned to Dresden where it has been displayed up to the present time. The Sistine Madonna got its beauty back and became a delight for millions of museum visitors.",
      ],
      statements: [
        statement(
          13,
          "In the past Dresden got its nickname for producing and selling jewellery.",
          "2",
        ),
        statement(
          14,
          "German and Russian specialists were rebuilding the city together after World War II.",
          "1",
        ),
        statement(
          15,
          "There was a local airport not far from the Dresden Art Gallery.",
          "3",
        ),
        statement(
          16,
          "The gallery keeper stated that the art collection had been taken away from the country.",
          "2",
        ),
        statement(
          17,
          "The search group managed to decode the top-secret map.",
          "1",
        ),
        statement(
          18,
          "The famous masterpiece The Sistine Madonna was found in a nearby town.",
          "2",
        ),
        statement(
          19,
          "Nowadays the restored collection of paintings can be seen in the museum in Dresden.",
          "1",
        ),
      ],
      strategy: NO_STRATEGY,
    },
  },

  grammar: {
    part20: {
      intro: COMMON.grammar.part20Intro,
      guideTasks: {
        pronoun: [21],
        tenses: [20, 22, 23, 24, 26, 27, 28],
        adjective: [25],
      },
      lines: [
        gap(
          20,
          "It is important to start planning your career from a very early age, right? Yesterday, I",
          "TRY",
          "to find out what my ten-year-old brother’s thoughts on the subject were.",
          "tried",
        ),
        gap(
          21,
          "I expected",
          "HE",
          "to say something like “I want to be an astronaut”, but his answer was surprising. “I want to be an ice cream taster,” he said.",
          "him",
        ),
        gap(
          22,
          "“What?” I",
          "NOT UNDERSTAND",
          "him at first.",
          "did not understand;didn’t understand",
        ),
        gap(23, "“There", "BE", "no such job as an ice cream taster.”", "is"),
        gap(
          24,
          "“Wrong,” my brother looked serious, “It",
          "EXIST",
          ".",
          "exists",
        ),
        gap(
          25,
          "And it is much",
          "DIFFICULT",
          "than most people think.”",
          "more difficult",
        ),
        gap(
          26,
          "Then the kid explained to me what the job",
          "INCLUDE",
          ". The ice cream taster had to taste up to 60 samples per day and choose the best flavour which would please the customers.",
          "included",
        ),
        gap(
          27,
          "“Don’t you think you",
          "GET",
          "sick if you eat so much ice cream? And how did you find out about that job at all?”",
          "will get;’ll get",
        ),
        gap(
          28,
          "“Tasting does not mean eating. And as for your second question, I",
          "READ",
          "56 job market reviews. Now I know a lot about the current job market. To be successful, I should start getting ready for my career as early as possible, shouldn’t I?”",
          "have read;’ve read",
        ),
      ],
      strategy: NO_STRATEGY,
    },
    part29: {
      intro: COMMON.grammar.part29Intro,
      lines: [
        gap(
          29,
          "Saint Petersburg, one of the most",
          "BEAUTY",
          "cities in the world, stands on the Neva River. The city was named after St Peter, the patron saint of its founder.",
          "beautiful",
        ),
        gap(
          30,
          "One of the reasons why Peter I chose that place for his new capital was that the Neva was",
          "SUIT",
          "for navigation.",
          "suitable",
        ),
        gap(
          31,
          "Peter I understood how important trade was for the economic",
          "DEVELOP",
          "of the country.",
          "development",
        ),
        gap(
          32,
          "He realised that to deliver goods by water was more convenient and less",
          "EXPENSE",
          "than by land.",
          "expensive",
        ),
        gap(
          33,
          "In fact, the Neva River was",
          "FAME",
          "long before the city of Saint Petersburg was founded.",
          "famous",
        ),
        gap(
          34,
          "In 1240, the Battle of the Neva happened there — the",
          "RUSSIA",
          "Army led by Prince Alexander Yaroslavovich defeated the Swedish Army. After that battle the prince got the name of Alexander Nevsky.",
          "Russian",
        ),
      ],
      strategy: NO_STRATEGY,
    },
  },

  writing: {
    n: 35,
    intro: COMMON.writing.intro,
    email: {
      from: "Duncan@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "Free time",
      body: [
        "Recently I’ve read an article about how to spend free time effectively. It’s important to organise our free time wisely…",
        "…Do you have enough free time, why? What do you usually do in your free time? What other activity would you like to try one day?…",
      ],
    },
    task: [
      "Write a message to Duncan and answer his 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: COMMON.writing.criteria,
    rules: COMMON.writing.rules,
    plan: [
      "Обращение: Dear Duncan, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — хватает ли вам свободного времени, и почему",
      "Абзац с ответом на вопрос 2 — чем вы обычно занимаетесь в свободное время",
      "Абзац с ответом на вопрос 3 — каким ещё занятием вы хотели бы заняться когда-нибудь",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя",
    ],
    template: COMMON.writing.template,
    sample: "",
    templateSample: "",
    samples: WRITING_SAMPLES["variant-6"],
    strategy: NO_STRATEGY,
  },

  speaking: {
    audioUrl: "/audio/oge/variant-6/speaking.mp3",

    task1: {
      ...COMMON.speaking.task1,
      text: "Have you ever played basketball? It is one of the most popular sports on the planet. The game is played by thousands of people. And millions watch it. One of the main reasons why basketball is so popular is that the game is easy and exciting. Basketball is a sport in which two teams of 5 players play against each other on a court. The players try to throw the ball into the opposing team’s basket to score points. Basketball was invented in 1891. A PE teacher wanted his students to be active during the long winter. He came up with the idea of a new dynamic team game. The game got its name due to the fruit baskets that were first used to catch the ball.",
      hardWords: [],
      strategy: NO_STRATEGY,
    },

    task2: {
      ...COMMON.speaking.task2,
      introText: `Electronic assistant: ${text.speaking.intro}`,
      outroText: `Electronic assistant: ${text.speaking.outro}`,
      questions: text.speaking.questions.map((question, index) => ({
        text: question,
        start: audio.speaking.questions[index].start,
        end: audio.speaking.questions[index].end,
        sample: "",
      })),
      outro: audio.speaking.outro,
      strategy: NO_STRATEGY,
    },

    task3: {
      ...COMMON.speaking.task3,
      instruction:
        "Task 3. You are going to give a talk about your career choice. You will have to start in 1.5 minutes and will speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "what jobs are popular with modern teenagers;",
        "what job you dreamed of in your childhood, and why;",
        "who can help you to make your career choice;",
        "what your attitude to a freelance job is.",
      ],
      sample: "",
      strategy: NO_STRATEGY,
    },
  },
};

/** Условия и ключи из книги плюс разбор каждого ответа */
export const variant6: OgeVariant = withExplanations(
  variant6Base,
  variant6Explained,
);
