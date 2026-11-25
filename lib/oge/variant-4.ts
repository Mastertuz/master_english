import marks from "./audio/variant-4.marks.json";
import script from "./audio/variant-4.script.json";
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
import { variant4Explained } from "./variant-4-explained";
import type { OgeVariant } from "./types";
import { WRITING_SAMPLES } from "./writing-samples";

const audio = marks as AudioMarks;
const text = script as AudioScript;

/**
 * Вариант 4 из сборника «ОГЭ. Типовые экзаменационные варианты».
 * Задания, ключи и тексты записей — из книги; запись озвучена нейросетью, разбор — variant-4-explained.ts.
 */
const variant4Base: OgeVariant = {
  id: "variant-4",
  title: "Вариант 4",
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. Запись озвучена нейросетевым голосом, пояснений к ответам нет",
  origin: { synthAudio: true, explained: false },
  rules: {},

  listening: {
    audioUrl: "/audio/oge/variant-4/listening.mp3",
    marks: audio.listening.marks,

    part1: {
      timecodes: audio.listening.part1.timecodes,
      intro: COMMON.listening.part1Intro,
      questions: [
        choice(
          1,
          "Text A. When are the winners of the competition going to get their awards?",
          ["On Friday.", "On Saturday.", "On Sunday."],
          "1",
        ),
        choice(
          2,
          "Text B. The girl wants to leave school earlier today because...",
          [
            "she is not feeling well.",
            "some classes are cancelled.",
            "she has to go to the library.",
          ],
          "2",
        ),
        choice(
          3,
          "Text C. What does Mark want to study at college?",
          ["Medicine.", "Journalism.", "Engineering."],
          "3",
        ),
        choice(
          4,
          "Text D. What is Alice’s favourite season?",
          ["Spring.", "Summer.", "Autumn."],
          "1",
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
          "Global warming",
          "Careful spending",
          "Natural disasters",
          "Air pollution",
          "Health problems",
          "Sea pollution",
        ],
        answer: "14256",
        extraWhy: "Ни один из говорящих не рассказывает о стихийных бедствиях.",
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
        wordRow(6, "Current job", "coach"),
        wordRow(7, "Age of the respondent (… years old)", "forty"),
        wordRow(8, "The country he/she visited last", "Turkey"),
        wordRow(9, "Favourite food", "pizza"),
        wordRow(10, "The musical instrument he/she plays", "piano"),
        wordRow(11, "Pet", "dog"),
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
          "What does the name the Golden Ring of Russia refer to?",
          "How did the name Golden Ring appear?",
          "When did the Golden Ring route become popular with tourists?",
          "What is the most amazing landmark of the Golden Ring?",
          "What is the oldest site of the Golden Ring?",
          "What do the Golden Ring towns have in common?",
          "How long does an average Golden Ring tour last?",
        ],
        answer: "314762",
        extraWhy:
          "Ни в одном тексте не сказано, какое место Золотого кольца самое древнее.",
      }),
      texts: [
        {
          letter: "A",
          text: "Thousands of tourists visit the historic towns of Russia. The Golden Ring became especially famous in the 1960s and 1970s. At that time, people became more interested in the history of ancient Russia, and they wanted to learn more about traditional culture. The route was officially recognized and developed for tourism. Soon both Russian and international tourists enjoyed travelling there and admired the magnificent sights.",
        },
        {
          letter: "B",
          text: "Russia is a huge country, so it has an enormous variety of landscapes, cultures, and historic places. It is not easy for tourists to make a list of places worth visiting — it seems endless! Most tour agencies, however, agree that the Golden Ring, a tour route that includes several ancient Russian towns with their old churches and monasteries, is a must for anyone who values history, culture and traditions.",
        },
        {
          letter: "C",
          text: "The Golden Ring tour presents an impressive display of ancient churches with golden domes, old monasteries, stone kremlins, and traditional wooden houses. Of course, each of the towns is wonderful, but the main gem in the collection is probably the Trinity Lavra of St. Sergius in the town of Sergiev Posad, which also functions as an important religious centre.",
        },
        {
          letter: "D",
          text: "The classic Golden Ring tour usually includes historic towns like Sergiev Posad, Pereslavl-Zalesski, Rostov, Vladimir, Suzdal and a few others. Tourists can choose how many towns they would like to visit, depending on their private circumstances and interests. A standard tour usually takes between two and five days, but tourist agencies also offer extended trips. They may be up to ten days or even longer.",
        },
        {
          letter: "E",
          text: "Every town of the Golden Ring route is unique, but some things join them together. In all of the towns, you will find elegant white-stone buildings and bright domes. The wooden architecture created by old masters is amazing — it is recognized as a typical feature of the whole route. Tourists just wonder how it was possible to build such beautiful wooden houses without modern technology.",
        },
        {
          letter: "F",
          text: "The Golden Ring tour means visiting historic towns to the northeast of Moscow, but on the map, the journey looks almost like a circle or a ring. The adjective golden is associated with the gilded domes of the churches that shine like jewels made of pure gold. In fact, the name was created by the journalist and historian Yuri Bychkov who published a series of articles about the towns under the title of The Golden Ring. His work attracted lots of attention to the region and the route.",
        },
      ],
      strategy: NO_STRATEGY,
    },

    part13: {
      intro: COMMON.reading.part13Intro,
      title: "The Woman who Understood Chimpanzees Better than Anyone",
      paragraphs: [
        "The forests and savannas of Central and West Africa are the places where chimpanzees live in the wild. Chimpanzees, along with gorillas and orangutans, are not exactly monkeys — they have no tail and are called apes. Chimpanzees are special because they are humans’ closest living relatives. For many years, however, scientists knew very little about how chimpanzees really lived — until one woman changed everything.",
        "Jane Goodall was a British scientist whose work transformed our understanding of animals. In 1960, she travelled to what is now Tanzania to study chimpanzees. At that time, most researchers observed animals from a distance. Jane Goodall did something different — she lived among the chimpanzees and patiently gained their trust.",
        "Her method was unusual, but it led to one of the most important discoveries in modern science. Jane Goodall observed chimpanzees making and using tools to get food, such as sticks to catch insects and stones to crack nuts. Before this, scientists believed that only humans could use tools. This discovery forced the scientific world to rethink the definition of what it means to be human.",
        "Goodall also showed that chimpanzees are not just instinct-driven animals. They have emotions, personalities, and social lives. Some are gentle, others are aggressive. They form friendships, care for their young, and sometimes fight in violent conflicts. She even discovered that chimpanzees can learn from each other, passing skills from one generation to the next — something we can call culture.",
        "Goodall’s love for animals began in childhood. One of her favourite possessions was a toy chimpanzee named Jubilee. While other children preferred dolls, she was fascinated by animals from an early age — a passion that would shape her entire life.",
        "However, Jane Goodall’s journey into science was not easy. As a young woman in London, Goodall worked as a secretary and dreamed of going to Africa. Her life changed when she met Louis Leakey, a leading scientist who believed in her research abilities and analytical mind. With Leakey’s support, she later earned a PhD from the University of Cambridge, which established her position as a scientist.",
        "Over the decades, Goodall’s work went beyond science. She became a global voice for conservation, animal welfare, and human responsibility toward nature. In 1977, she founded the Jane Goodall Institute, which continues to protect wildlife and support communities around the world. In 2002, she was named a United Nations Messenger of Peace. Jane Goodall died in 2025, at the age of 91. Along with the discoveries she made, she also showed that the line between humans and other species is thinner than we once believed.",
      ],
      statements: [
        statement(13, "Gorillas and chimpanzees are enemies in the wild.", "3"),
        statement(
          14,
          "Jane Goodall used a new approach to study chimpanzees and their habits.",
          "1",
        ),
        statement(
          15,
          "Jane Goodall found out that, when needed, chimpanzees were able to use tools.",
          "1",
        ),
        statement(
          16,
          "Jane Goodall was sure that not only the character but the seasonal diet affected the chimpanzees’ behaviour.",
          "3",
        ),
        statement(
          17,
          "Jubilee was the name of the oldest chimpanzee Jane Goodall observed in Africa.",
          "2",
        ),
        statement(18, "Jane Goodall never had a university degree.", "2"),
        statement(
          19,
          "Jane Goodall established an organisation to protect animals and nature.",
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
        pronoun: [20],
        tenses: [21, 22, 23, 24, 27, 28],
        passive: [25],
        adjective: [26],
      },
      lines: [
        gap(
          20,
          "Andy and her friend Jess were sitting on the sofa. Two bowls with chips were between",
          "THEY",
          ". “We should start doing some sport,” Andy suddenly said, scrolling through her phone.",
          "them",
        ),
        gap(
          21,
          "Jess looked at her in surprise. Then she",
          "STAND",
          "up, came up to the kitchen cupboard and added more chips to her bowl. “Why should we?” she asked at last.",
          "stood",
        ),
        gap(
          22,
          "“I",
          "FIND",
          "out that almost everyone in the class does some sport,” explained Andy.",
          "have found;’ve found;found",
        ),
        gap(
          23,
          "“Jack is a footballer, Sandra",
          "PRACTISE",
          "yoga and Sam’s often seen in the swimming pool.",
          "practises;practices",
        ),
        gap(
          24,
          "A year ago, he",
          "NOT CAN",
          "swim at all, and next month he’s taking part in a competition!",
          "could not;couldn’t",
        ),
        gap(
          25,
          "He",
          "INVITE",
          "to join the School Water Polo Club last Monday. Impressive, isn’t it?",
          "was invited",
        ),
        gap(26, "But we can do even", "GOOD", "than him, can’t we?”", "better"),
        gap(
          27,
          "“Are you saying we should try swimming?” Jess didn’t sound enthusiastic. There",
          "BE",
          "an expression of doubt in her eyes. “I don’t like swimming. I need to think and choose a sport I would really like to do.”",
          "was",
        ),
        gap(
          28,
          "“Fine! I",
          "CALL",
          "you tomorrow to discuss your ideas,” Andy gave her friend a broad smile. “We need to find something we both enjoy.”",
          "shall call;will call;’ll call",
        ),
      ],
      strategy: NO_STRATEGY,
    },
    part29: {
      intro: COMMON.grammar.part29Intro,
      lines: [
        gap(
          29,
          "Have you heard about Egyptian hieroglyphs? It was a writing system used for",
          "COMMUNICATE",
          "in Ancient Egypt.",
          "communication",
        ),
        gap(
          30,
          "The system was",
          "ORIGIN",
          "but not easy to understand. One symbol, or a hieroglyph, could denote a sound, a word, or even a concept.",
          "original",
        ),
        gap(
          31,
          "Hieroglyphs were",
          "CAREFUL",
          "designed and could be very detailed.",
          "carefully",
        ),
        gap(
          32,
          "It obviously took an Egyptian",
          "WRITE",
          "a lot of time to create a single papyrus scroll (an early version of what we call a manuscript now).",
          "writer",
        ),
        gap(
          33,
          "The ancient scrolls are",
          "PRICE",
          ". They are kept in museums as they are very delicate and can be easily destroyed.",
          "priceless",
        ),
        gap(
          34,
          "That is why they are",
          "AVAILABLE",
          "to the public, but you can see some of them online as photos in digital collections.",
          "unavailable",
        ),
      ],
      strategy: NO_STRATEGY,
    },
  },

  writing: {
    n: 35,
    intro: COMMON.writing.intro,
    email: {
      from: "Sue@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "Staying healthy",
      body: [
        "Yesterday I felt sick and missed my friend’s birthday party. The doctor said that I had to pay more attention to my eating habits and my daily routine…",
        "…What time do you usually go to bed? How often do you eat fast food? What do you do to stay healthy?…",
      ],
    },
    task: [
      "Write a message to Sue and answer her 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: COMMON.writing.criteria,
    rules: COMMON.writing.rules,
    plan: [
      "Обращение: Dear Sue, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — во сколько вы обычно ложитесь спать",
      "Абзац с ответом на вопрос 2 — как часто вы едите фастфуд",
      "Абзац с ответом на вопрос 3 — что вы делаете, чтобы оставаться здоровым",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя",
    ],
    template: COMMON.writing.template,
    sample: "",
    templateSample: "",
    samples: WRITING_SAMPLES["variant-4"],
    strategy: NO_STRATEGY,
  },

  speaking: {
    audioUrl: "/audio/oge/variant-4/speaking.mp3",

    task1: {
      ...COMMON.speaking.task1,
      text: "Unlike a painting, a sketch is a quick drawing that captures the main idea of an object without many details. Artists often sketch streets, cafés, flowers, food, or buildings. In Moscow, many young artists like drawing the views of the underground metro stations. And there are 275 of them in the city! In 2025, Moscow hosted an online ceremony for international sketching awards. Sketching is popular with young and old. It’s fun, and no expensive equipment is needed. Besides, experts say that regular sketching helps people improve memory, attention, and creativity. Have you ever tried sketching? You definitely should! It’s easier to start by sketching simple shapes and everyday objects.",
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
        "Task 3. You are going to give a talk about travelling. You will have to start in 1.5 minutes and will speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "what means of transport most people use for travelling nowadays;",
        "what people usually do when they visit a new place;",
        "what place you would like to visit one day, and why;",
        "what your attitude to travelling is.",
      ],
      sample: "",
      strategy: NO_STRATEGY,
    },
  },
};

/** Условия и ключи из книги плюс разбор каждого ответа */
export const variant4: OgeVariant = withExplanations(
  variant4Base,
  variant4Explained,
);
