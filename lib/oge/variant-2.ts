import marks from "./audio/variant-2.marks.json";
import script from "./audio/variant-2.script.json";
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
import { variant2Explained } from "./variant-2-explained";
import type { OgeVariant } from "./types";

const audio = marks as AudioMarks;
const text = script as AudioScript;

/**
 * Вариант 2 из сборника «ОГЭ. Типовые экзаменационные варианты».
 * Задания, ключи и тексты записей — из книги; запись озвучена нейросетью, разбор — variant-2-explained.ts.
 */
const variant2Base: OgeVariant = {
  id: "variant-2",
  title: "Вариант 2",
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. Запись озвучена нейросетевым голосом, пояснений к ответам нет",
  origin: { synthAudio: true, explained: false },
  rules: {},

  listening: {
    audioUrl: "/audio/oge/variant-2/listening.mp3",
    marks: audio.listening.marks,

    part1: {
      timecodes: audio.listening.part1.timecodes,
      intro: COMMON.listening.part1Intro,
      questions: [
        choice(1, "Text A. What do you need to buy to get a chocolate bar for free?", [
          "Lemons, bananas and carrots.",
          "Yogurt, apple, and bread.",
          "Cucumbers, tomatoes and sausages.",
        ], "1"),
        choice(2, "Text B. In a few minutes the girl will be...", [
          "having an important conversation.",
          "watching a new film.",
          "writing an exam test.",
        ], "2"),
        choice(3, "Text C. Where have Mia and Alex decided to go?", [
          "To the art exhibition.",
          "To see a friend.",
          "To the cinema.",
        ], "3"),
        choice(4, "Text D. Currently Ben is...", [
          "at school.",
          "at university.",
          "on his gap year.",
        ], "1"),
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
          "An innovative and high-tech place",
          "Customs and traditions",
          "History and modern life",
          "Urban myths and legends",
          "A nice and quiet place",
          "A dynamic and exciting place",
        ],
        answer: "53261",
        extraWhy: "Ни один из говорящих не рассказывает городские мифы и легенды.",
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
        wordRow(6, "Age of the respondent (… years old)", "fourteen"),
        wordRow(7, "Favourite school subject", "Literature"),
        wordRow(8, "Number of books in the home library", "eighty"),
        wordRow(9, "Regular sports activity", "cycling"),
        wordRow(10, "Pet", "snake"),
        wordRow(11, "The country he/she would like to visit", "Finland"),
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
          "What is the @ symbol used in email addresses for?",
          "What do people from European countries associate the @ symbol with?",
          "What interpretation of the @ symbol is popular with Russian users?",
          "What symbols, except for the @ symbol, are essential for an email address?",
          "Did people use the @ symbol before computers were invented?",
          "How did the @ symbol come into use in the computer network?",
          "What updates made email communication more convenient in the 21st century?",
        ],
        answer: "561273",
        extraWhy: "Ни в одном тексте не сказано, какие ещё символы обязательны в адресе электронной почты.",
      }),
      texts: [
        {
          letter: "A",
          text: "In fact, there is no fully proven explanation of the symbol’s origin. Some linguists believe that @ symbol, which is pronounced like ‘at’, existed in Latin. Historians have found ancient records where the sign was used for measuring liquids. Probably the most realistic explanation is that it appeared on typewriters as a separate key. The symbol was used as a preposition and later moved onto computer keyboards, where it remains today.",
        },
        {
          letter: "B",
          text: "However, Ray Tomlinson, the inventor of the modern email address format, was not a typist. He worked as an engineer for an IT company. The main problem he faced was how to send messages from one computer to another. A simple solution came suddenly when he noticed the @ symbol on the keyboard. He used it to separate names of computers, so the system started working properly.",
        },
        {
          letter: "C",
          text: "Messengers are useful for different styles of communication. People connect through private and group chats because they are quick and convenient. However, more formal messages are usually sent by email. Both forms of communication have their own special language, symbols, and images. For example, an email address uses the @ symbol, and it is impossible to create an email address without it. The symbol @ separates the user’s name from the name of the mail service.",
        },
        {
          letter: "D",
          text: "The symbol @ is recognized all over the world. Italians say it looks like a snail, while the French compare it to a monkey’s tail. Although monkeys are popular in Eastern cultures, people there do not use this image in computer terminology. Instead, they often compare the symbol to a little mouse. There are even tasty versions of its name. In Sweden, for example, people associate it with a traditional cinnamon bun.",
        },
        {
          letter: "E",
          text: "In fact, Ray Tomlinson helped create a technology that connected computers into a network and made virtual communication possible. Although email became truly popular only after the appearance of web browsers, its invention was a major technological breakthrough. In the 2000s, email services were improved with cloud storage and many other features. Later, Tomlinson’s name was added to the Internet Hall of Fame.",
        },
        {
          letter: "F",
          text: "The first official name for @ symbol came from English. The symbol became known as the ‘at sign’ or simply ‘at’. This word later became international in computer science. However, in Russian, it received a surprising nickname — ‘a dog’. Because of its funny animal image, the name became popular among users and IT specialists. Some people also connect it with early computer games.",
        },
      ],
      strategy: NO_STRATEGY,
    },

    part13: {
      intro: COMMON.reading.part13Intro,
      title: "Music Saves Whales",
      paragraphs: [
        "The beluga whale, also known as the white whale, is an Arctic animal. These whales migrate seasonally within the Arctic and sub-Arctic regions, but they generally do not migrate outside the Arctic in the way that some birds leave their breeding grounds for different, much warmer climates. In spring and summer, the huge marine animals come to coastal waters, but in autumn, they travel back, deeper into the Arctic Ocean.",
        "From time to time, beluga whales have to breathe in some air, which is why they usually stay close to the edge of the ice. Sometimes, they may get trapped under the thick ice. In 1984, for example, about two thousand whales could have died in the Bering Sea if people had not helped them. The rescue operation took several weeks and was widely reported in the media.",
        "The whales were first seen from a helicopter that was checking ships at the end of the navigation season. At first, the people did not see any particular danger as whales had often been seen in those waters. Then the situation changed dramatically. As ice became thicker, it blocked the way to the open sea and the animals got trapped. A few holes in the ice gave the whales air, but they were not enough for so many animals. The whales gathered near the holes, staying upright. Soon they began to panic — they suffered from hunger and started fighting for space.",
        "Local fishermen did their best to help the whales. They broke the ice to make the holes bigger and brought frozen fish to the belugas. That helped them survive for a few weeks. However, that was not enough as the ice kept growing.",
        "Finally, it was decided to use an icebreaker ship. It took a long while for the icebreaker to get through the thick ice, but it arrived in time. It broke the ice to make a way to the open water, but the whales felt scared of the engine noise and refused to follow the icebreaker. Each time the engine started, they stopped moving. The passage was freezing over quickly again. Something had to be done to encourage the animals to move. Then the captain had a clever idea — to use music to attract the whales.",
        "Beluga whales are often called ‘sea canaries’ because they can produce high-pitched sounds as if they were singing. The case with the trapped animals showed that they are able not only to sing but also to appreciate good music! The crew put powerful speakers on the ship and played music while the engine was working. They tried different types of music, but classical music by Pyotr Ilyich Tchaikovsky worked best. The whales slowly followed the ship through the passage and finally reached open water eighteen miles away.",
      ],
      statements: [
        statement(13, "In winter, the beluga whales migrate from the Arctic Ocean to the warmer waters of the Pacific Ocean.", "2"),
        statement(14, "When beluga whales hunt fish under the ice, they hunt in small groups.", "3"),
        statement(15, "The helicopter crew patrolling the area noticed the whales.", "1"),
        statement(16, "The local fishermen refused to help the beluga whales.", "2"),
        statement(17, "There were marine biologists on board the icebreaker.", "3"),
        statement(18, "The sound of the ice-breaker’s engine frightened the whales.", "1"),
        statement(19, "P.I. Tchaikovsky was the captain’s favourite composer.", "3"),
      ],
      strategy: NO_STRATEGY,
    },
  },

  grammar: {
    part20: {
      intro: COMMON.grammar.part20Intro,
      guideTasks: {
        pronoun: [28],
        numeral: [25],
        tenses: [20, 21, 23, 24, 26, 27],
        passive: [22],
      },
      lines: [
        gap(20, "“Do you know who did it first?” Katie was standing in front of the wall. There", "BE", "a large calendar on it.", "was"),
        gap(21, "“Who did what?” Monica looked at her friend in surprise. “Oh, this calendar? I have no idea. I", "BUY", "it last December in our bookshop.”", "bought"),
        gap(22, "“No, I’m just curious when the calendar", "INVENT", "and why. Why did people decide to measure time by dividing it into years, months, and days?”", "was invented"),
        gap(23, "Monica smiled. She wanted to say that she", "UNDERSTAND", "how Katie felt.", "understood"),
        gap(24, "But she", "NOT SAY", "anything, and Katie went on, “I’m feeling nervous these days because it’s my birthday tomorrow.", "did not say;didn’t say"),
        gap(25, "My", "EIGHTEEN", "birthday. I’m going to be an adult. I wish I knew what it means.”", "eighteenth"),
        gap(26, "Monica laughed, “Don’t be so dramatic! Nothing", "CHANGE", "tomorrow.", "will change"),
        gap(27, "But please don’t forget that I", "ORDER", "a birthday cake for you, and it will be delivered tomorrow morning between 9 and 10 o’clock.", "have ordered;’ve ordered"),
        gap(28, "And as for the calendar... Ancient Egyptians had a solar calendar more than 5000 years ago. Ancient Romans created", "THEY", "own version later. It is really an interesting question, and I’d like to look into it.”", "their"),
      ],
      strategy: NO_STRATEGY,
    },
    part29: {
      intro: COMMON.grammar.part29Intro,
      lines: [
        gap(29, "Sakhalin is a large island in the Far East of Russia. Although it is relatively far from the mainland, this", "ISOLATE", "island plays a key role in controlling sea routes and providing access to the Pacific Ocean.", "isolated"),
        gap(30, "Sakhalin is also rich in", "NATURE", "resources, especially oil and gas.", "natural"),
        gap(31, "For tourists, Sakhalin is an irresistible", "ATTRACT", ".", "attraction"),
        gap(32, "If you love", "HIKE", ", the island offers stunning landscapes.", "hiking"),
        gap(33, "If you are an", "ECOLOGY", "or a wildlife photographer, the rich and diverse wildlife of this place will impress you.", "ecologist"),
        gap(34, "", "LUCK", "tourists may even see the Steller’s sea eagle, one of the biggest and rarest eagles in the world, which is the symbol of the wild nature of the region.", "lucky"),
      ],
      strategy: NO_STRATEGY,
    },
  },

  writing: {
    n: 35,
    intro: COMMON.writing.intro,
    email: {
      from: "Alice@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "School holidays",
      body: [
        "…Most of my friends look forward to summer holidays. However, I prefer winter holidays for several reasons…",
        "…What school holidays do you prefer, why? What is your day like when you are on holiday? What do you do to keep up your English skills during the holidays?…",
      ],
    },
    task: [
      "Write a message to Alice and answer her 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: COMMON.writing.criteria,
    rules: COMMON.writing.rules,
    plan: [
      "Обращение: Dear Alice, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — какие каникулы вы предпочитаете и почему",
      "Абзац с ответом на вопрос 2 — какой у вас день на каникулах",
      "Абзац с ответом на вопрос 3 — что вы делаете на каникулах, чтобы не терять английский",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя",
    ],
    template: COMMON.writing.template,
    sample: "",
    templateSample: "",
    strategy: NO_STRATEGY,
  },

  speaking: {
    audioUrl: "/audio/oge/variant-2/speaking.mp3",

    task1: {
      ...COMMON.speaking.task1,
      text: "Rainforests grow in South America near the equator, where the climate is hot and wet all year round. These tropical jungles are among the richest ecosystems on the Earth. Lots of animals, birds, insects, and plants live there. Many animals spend most of their lives high in the trees, eating leaves and fruit. The trees can reach up to 60 metres in height. They form a thick green roof that protects lower plants from strong sunlight and heavy rain. Sadly, large areas of the rainforest were destroyed in the 1980s. Cutting out trees damaged the climate, reduced rainfall, and made dry seasons longer. Today, climate change remains a serious global problem caused mainly by human activity.",
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
        "Task 3. You are going to give a talk about sports. You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "whether doing sports is getting more and more popular with teenagers, and why;",
        "what sports facilities teenagers can use in your city/town;",
        "what sport or sports activity you regularly do;",
        "what your attitude to doing sport is.",
      ],
      sample: "",
      strategy: NO_STRATEGY,
    },
  },
};

/** Условия и ключи из книги плюс разбор каждого ответа */
export const variant2: OgeVariant = withExplanations(variant2Base, variant2Explained);
